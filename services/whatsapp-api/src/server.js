import "dotenv/config";
import cors from "cors";
import express from "express";
import pino from "pino";
import qrcode from "qrcode";
import { mkdir } from "node:fs/promises";
import { Boom } from "@hapi/boom";
import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || "info" });

const PORT = Number.parseInt(process.env.PORT ?? "3001", 10);
const WHATSAPP_API_KEY = (process.env.WHATSAPP_API_KEY ?? "").trim();
const AUTH_DIR = (process.env.AUTH_DIR ?? ".baileys_auth").trim();
const OWNER_NOTIFY_TO = (process.env.OWNER_NOTIFY_TO ?? "").trim();
const CLIENT_ACK_ENABLED =
  (process.env.CLIENT_ACK_ENABLED ?? "true").trim().toLowerCase() !== "false";
const CLIENT_ACK_TEXT = (
  process.env.CLIENT_ACK_TEXT ??
  "Recebemos sua mensagem na InfraCode. Em breve nosso time entra em contato."
).trim();

let socket = null;
let reconnectTimer = null;

const runtimeState = {
  connected: false,
  connecting: false,
  lastError: null,
  lastQr: null,
  lastQrAt: null,
  lastQrDataUrl: null,
  meId: null,
};

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const sanitizePhone = (value) => (value ?? "").replace(/\D/g, "");

const normalizePhone = (value) => {
  const digits = sanitizePhone(value);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("55")) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
};

const toJid = (phone) => `${normalizePhone(phone)}@s.whatsapp.net`;

const apiKeyGuard = (req, res, next) => {
  if (!WHATSAPP_API_KEY) {
    res.status(503).json({
      ok: false,
      message: "WHATSAPP_API_KEY nao configurada na WhatsApp API.",
    });
    return;
  }

  const providedKey = (req.header("x-api-key") ?? "").trim();
  if (providedKey !== WHATSAPP_API_KEY) {
    res.status(401).json({
      ok: false,
      message: "Nao autorizado.",
    });
    return;
  }

  next();
};

const scheduleReconnect = () => {
  if (reconnectTimer) {
    return;
  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void startSocket();
  }, 2000);
};

const startSocket = async () => {
  if (runtimeState.connecting || runtimeState.connected) {
    return;
  }

  runtimeState.connecting = true;
  runtimeState.lastError = null;

  try {
    await mkdir(AUTH_DIR, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      printQRInTerminal: false,
      browser: Browsers.ubuntu("InfraCode WhatsApp API"),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      logger,
      markOnlineOnConnect: false,
      syncFullHistory: false,
    });

    socket = sock;

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        runtimeState.lastQr = qr;
        runtimeState.lastQrAt = new Date().toISOString();
        try {
          runtimeState.lastQrDataUrl = await qrcode.toDataURL(qr, { margin: 1, width: 300 });
        } catch (error) {
          logger.warn({ error }, "Nao foi possivel gerar QR Data URL");
        }
      }

      if (connection === "open") {
        runtimeState.connected = true;
        runtimeState.connecting = false;
        runtimeState.meId = sock.user?.id ?? null;
        runtimeState.lastQr = null;
        runtimeState.lastQrDataUrl = null;
        runtimeState.lastError = null;
        logger.info({ me: runtimeState.meId }, "WhatsApp conectado");
      }

      if (connection === "close") {
        runtimeState.connected = false;
        runtimeState.connecting = false;
        runtimeState.meId = null;

        const statusCode =
          lastDisconnect?.error instanceof Boom
            ? lastDisconnect.error.output.statusCode
            : null;

        runtimeState.lastError = statusCode
          ? `Disconnected (${statusCode})`
          : "Disconnected";

        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        logger.warn(
          {
            shouldReconnect,
            statusCode,
          },
          "Conexao WhatsApp encerrada",
        );

        if (shouldReconnect) {
          scheduleReconnect();
        }
      }
    });
  } catch (error) {
    runtimeState.connecting = false;
    runtimeState.connected = false;
    runtimeState.lastError = error instanceof Error ? error.message : "Erro desconhecido";
    logger.error({ error }, "Falha ao iniciar Baileys");
    scheduleReconnect();
  }
};

const assertConnected = () => {
  if (!socket || !runtimeState.connected) {
    const error = new Error("WhatsApp desconectado. Escaneie o QR e tente novamente.");
    error.statusCode = 503;
    throw error;
  }
};

const sendText = async (to, text) => {
  assertConnected();

  const normalized = normalizePhone(to);
  if (!normalized) {
    const error = new Error("Numero de destino invalido.");
    error.statusCode = 422;
    throw error;
  }

  const response = await socket.sendMessage(toJid(normalized), { text });
  return {
    messageId: response?.key?.id ?? null,
    to: normalized,
  };
};

const buildLeadMessage = (lead) =>
  [
    "Novo contato pelo site da InfraCode",
    "",
    `Nome: ${lead.name}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${normalizePhone(lead.phone)}`,
    "",
    "Mensagem:",
    lead.message,
  ].join("\n");

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "whatsapp-api",
    connected: runtimeState.connected,
    connecting: runtimeState.connecting,
  });
});

app.get("/session/status", apiKeyGuard, (_req, res) => {
  res.status(200).json({
    ok: true,
    data: {
      connected: runtimeState.connected,
      connecting: runtimeState.connecting,
      hasQr: Boolean(runtimeState.lastQr),
      lastQrAt: runtimeState.lastQrAt,
      meId: runtimeState.meId,
      lastError: runtimeState.lastError,
    },
  });
});

app.get("/session/qr", apiKeyGuard, (_req, res) => {
  res.status(200).json({
    ok: true,
    data: {
      qr: runtimeState.lastQr,
      qrDataUrl: runtimeState.lastQrDataUrl,
      lastQrAt: runtimeState.lastQrAt,
      connected: runtimeState.connected,
    },
  });
});

app.post("/session/reconnect", apiKeyGuard, async (_req, res) => {
  runtimeState.connected = false;
  runtimeState.connecting = false;

  if (socket) {
    try {
      socket.end(new Error("manual reconnect"));
    } catch (error) {
      logger.warn({ error }, "Falha ao encerrar sessao antes de reconectar");
    }
  }

  void startSocket();

  res.status(200).json({
    ok: true,
    message: "Reconexao solicitada.",
  });
});

app.post("/messages/text", apiKeyGuard, async (req, res) => {
  try {
    const to = typeof req.body?.to === "string" ? req.body.to : "";
    const text = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!to || !text) {
      res.status(422).json({
        ok: false,
        message: "Informe `to` e `message`.",
      });
      return;
    }

    const sent = await sendText(to, text);
    res.status(200).json({
      ok: true,
      data: sent,
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? error.statusCode
        : 500;
    res.status(statusCode).json({
      ok: false,
      message: error instanceof Error ? error.message : "Falha ao enviar mensagem.",
    });
  }
});

app.post("/lead", apiKeyGuard, async (req, res) => {
  try {
    const lead = {
      name: typeof req.body?.name === "string" ? req.body.name.trim() : "",
      email: typeof req.body?.email === "string" ? req.body.email.trim() : "",
      phone: typeof req.body?.phone === "string" ? req.body.phone.trim() : "",
      message: typeof req.body?.message === "string" ? req.body.message.trim() : "",
    };

    const errors = [];

    if (lead.name.length < 2) errors.push("Nome invalido.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.push("Email invalido.");
    if (normalizePhone(lead.phone).length < 12) errors.push("WhatsApp invalido.");
    if (lead.message.length < 10) errors.push("Mensagem muito curta.");

    if (errors.length > 0) {
      res.status(422).json({
        ok: false,
        errors,
      });
      return;
    }

    const notifyTo = normalizePhone(
      typeof req.body?.notifyTo === "string" ? req.body.notifyTo : OWNER_NOTIFY_TO,
    );
    const sendClientAck =
      typeof req.body?.sendClientAck === "boolean"
        ? req.body.sendClientAck
        : CLIENT_ACK_ENABLED;
    const clientAckText =
      typeof req.body?.clientAckText === "string" && req.body.clientAckText.trim()
        ? req.body.clientAckText.trim()
        : CLIENT_ACK_TEXT;

    let internalSent = false;
    let clientSent = false;
    const sendErrors = [];

    if (notifyTo) {
      try {
        await sendText(notifyTo, buildLeadMessage(lead));
        internalSent = true;
      } catch (error) {
        sendErrors.push("internal");
        logger.error({ error }, "Erro enviando lead para numero interno");
      }
    }

    if (sendClientAck) {
      try {
        await sendText(lead.phone, `Oi, ${lead.name}! ${clientAckText}`);
        clientSent = true;
      } catch (error) {
        sendErrors.push("client");
        logger.error({ error }, "Erro enviando confirmacao ao cliente");
      }
    }

    if (!internalSent && !clientSent) {
      res.status(502).json({
        ok: false,
        message: "Nenhuma mensagem foi enviada.",
        data: {
          internalSent,
          clientSent,
          errors: sendErrors,
        },
      });
      return;
    }

    res.status(200).json({
      ok: true,
      data: {
        internalSent,
        clientSent,
        errors: sendErrors,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : "Erro interno.",
    });
  }
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, "WhatsApp API iniciada");
  void startSocket();
});
