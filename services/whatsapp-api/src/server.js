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
const REQUIRE_INTERNAL_NOTIFY =
  (process.env.REQUIRE_INTERNAL_NOTIFY ?? "false").trim().toLowerCase() !== "false";

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

const dashboardHtml = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>InfraCode WhatsApp API</title>
  <style>
    :root {
      --bg: #0f172a;
      --panel: #111827;
      --text: #e5e7eb;
      --muted: #9ca3af;
      --accent: #f97316;
      --line: #1f2937;
    }
    * { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; }
    body { margin: 0; background: linear-gradient(180deg, #020617, var(--bg)); color: var(--text); }
    .wrap { max-width: 980px; margin: 0 auto; padding: 24px 16px 48px; }
    .card { background: color-mix(in oklab, var(--panel) 92%, black); border: 1px solid var(--line); border-radius: 14px; padding: 16px; margin-bottom: 14px; }
    h1 { margin: 0 0 14px; font-size: 22px; }
    h2 { margin: 0 0 8px; font-size: 16px; }
    p { margin: 0; color: var(--muted); }
    .row { display: grid; gap: 10px; margin-top: 10px; }
    .row.two { grid-template-columns: 1fr 1fr; }
    input, textarea, button {
      width: 100%; border-radius: 10px; border: 1px solid #334155; background: #0b1220; color: var(--text); padding: 10px 12px;
    }
    textarea { min-height: 80px; resize: vertical; }
    button { background: var(--accent); color: white; border: none; cursor: pointer; font-weight: 600; }
    button.secondary { background: #1f2937; }
    .actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; white-space: pre-wrap; background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 10px; min-height: 80px; }
    .status { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; margin-top: 8px; }
    .dot { width: 10px; height: 10px; border-radius: 999px; background: #ef4444; }
    .dot.ok { background: #22c55e; }
    img { max-width: 280px; width: 100%; border-radius: 10px; border: 1px solid #334155; background: #fff; padding: 8px; }
    @media (max-width: 860px) {
      .row.two, .actions { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <h1>InfraCode WhatsApp API</h1>
    <div class="card">
      <h2>Autenticacao</h2>
      <p>Use a mesma chave configurada em <span class="mono">WHATSAPP_API_KEY</span>.</p>
      <div class="row">
        <input id="apiKey" placeholder="x-api-key" />
      </div>
      <div class="actions">
        <button id="statusBtn" class="secondary">Atualizar Status</button>
        <button id="qrBtn" class="secondary">Atualizar QR</button>
        <button id="reconnectBtn" class="secondary">Reconectar Sessao</button>
      </div>
      <div class="status">
        <span id="statusDot" class="dot"></span>
        <span id="statusText">Status desconhecido</span>
      </div>
      <div class="row two">
        <div>
          <h2 style="margin-top:12px;">QR atual</h2>
          <img id="qrImg" alt="QR Code" />
        </div>
        <div>
          <h2 style="margin-top:12px;">Diagnostico</h2>
          <div id="debugOut" class="mono"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Teste de envio</h2>
      <div class="row">
        <input id="to" placeholder="Numero destino (ex: 5568999999999)" />
        <textarea id="msg" placeholder="Mensagem de teste">Teste InfraCode API OK</textarea>
      </div>
      <div class="actions">
        <button id="sendBtn">Enviar mensagem</button>
      </div>
      <div id="sendOut" class="mono"></div>
    </div>
  </main>

  <script>
    const apiKeyInput = document.getElementById("apiKey");
    const statusBtn = document.getElementById("statusBtn");
    const qrBtn = document.getElementById("qrBtn");
    const reconnectBtn = document.getElementById("reconnectBtn");
    const sendBtn = document.getElementById("sendBtn");
    const qrImg = document.getElementById("qrImg");
    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");
    const debugOut = document.getElementById("debugOut");
    const sendOut = document.getElementById("sendOut");
    const toInput = document.getElementById("to");
    const msgInput = document.getElementById("msg");

    const saved = localStorage.getItem("infracode-wa-api-key");
    if (saved) apiKeyInput.value = saved;

    function headers() {
      const key = apiKeyInput.value.trim();
      localStorage.setItem("infracode-wa-api-key", key);
      return { "x-api-key": key, "content-type": "application/json" };
    }

    function pretty(obj) {
      return JSON.stringify(obj, null, 2);
    }

    async function refreshStatus() {
      const [statusRes, debugRes] = await Promise.all([
        fetch("/session/status", { headers: headers() }),
        fetch("/debug/config", { headers: headers() }),
      ]);
      const statusPayload = await statusRes.json();
      const debugPayload = await debugRes.json();

      const connected = Boolean(statusPayload?.data?.connected);
      statusDot.className = connected ? "dot ok" : "dot";
      statusText.textContent = connected
        ? "Conectado"
        : (statusPayload?.data?.connecting ? "Conectando..." : "Desconectado");

      debugOut.textContent = pretty({
        status: statusPayload,
        config: debugPayload,
      });
    }

    async function refreshQr() {
      const response = await fetch("/session/qr", { headers: headers() });
      const payload = await response.json();
      qrImg.src = payload?.data?.qrDataUrl || "";
      if (!payload?.data?.qrDataUrl) {
        qrImg.alt = "Sem QR disponivel";
      }
    }

    async function reconnect() {
      const response = await fetch("/session/reconnect", {
        method: "POST",
        headers: headers(),
      });
      const payload = await response.json();
      debugOut.textContent = pretty(payload);
      await refreshStatus();
      await refreshQr();
    }

    async function sendTest() {
      const payload = {
        to: toInput.value.trim(),
        message: msgInput.value,
      };

      const response = await fetch("/messages/text", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });
      sendOut.textContent = pretty(await response.json());
    }

    statusBtn.addEventListener("click", () => void refreshStatus());
    qrBtn.addEventListener("click", () => void refreshQr());
    reconnectBtn.addEventListener("click", () => void reconnect());
    sendBtn.addEventListener("click", () => void sendTest());

    void refreshStatus();
    void refreshQr();
  </script>
</body>
</html>`;

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

app.get("/", (_req, res) => {
  res.status(200).type("html").send(dashboardHtml);
});

app.get("/debug/config", apiKeyGuard, (_req, res) => {
  const ownerNumber = normalizePhone(OWNER_NOTIFY_TO);
  res.status(200).json({
    ok: true,
    data: {
      clientAckEnabled: CLIENT_ACK_ENABLED,
      ownerNotifyTo: ownerNumber,
      requireInternalNotify: REQUIRE_INTERNAL_NOTIFY,
    },
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
    const ownerConfigured = Boolean(notifyTo);

    if (!ownerConfigured) {
      sendErrors.push("internal_not_configured");
      if (REQUIRE_INTERNAL_NOTIFY) {
        res.status(503).json({
          ok: false,
          message:
            "OWNER_NOTIFY_TO nao configurado e REQUIRE_INTERNAL_NOTIFY=true.",
          data: {
            internalSent,
            clientSent,
            errors: sendErrors,
            ownerConfigured,
            requireInternalNotify: REQUIRE_INTERNAL_NOTIFY,
          },
        });
        return;
      }
    }

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

    if (REQUIRE_INTERNAL_NOTIFY && !internalSent) {
      res.status(502).json({
        ok: false,
        message: "Falha ao enviar notificacao para numero interno.",
        data: {
          internalSent,
          clientSent,
          errors: sendErrors,
          ownerConfigured,
          requireInternalNotify: REQUIRE_INTERNAL_NOTIFY,
        },
      });
      return;
    }

    if (!internalSent && !clientSent) {
      res.status(502).json({
        ok: false,
        message: "Nenhuma mensagem foi enviada.",
        data: {
          internalSent,
          clientSent,
          errors: sendErrors,
          ownerConfigured,
          requireInternalNotify: REQUIRE_INTERNAL_NOTIFY,
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
        ownerConfigured,
        requireInternalNotify: REQUIRE_INTERNAL_NOTIFY,
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
