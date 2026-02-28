import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = "0.0.0.0";
const PORT = Number.parseInt(process.env.PORT ?? "8080", 10);
const DIST_DIR = path.join(__dirname, "dist");
const INDEX_FILE = path.join(DIST_DIR, "index.html");
const MAX_BODY_SIZE = 1_000_000;
const DEFAULT_INSTAGRAM_URL =
  "https://www.instagram.com/infracode_br?igsh=aDVoeHFkZWR1ZWd2";
const DEFAULT_WHATSAPP_MESSAGE =
  "Ola! Vim pelo site da InfraCode e gostaria de conversar sobre um projeto.";
const DEFAULT_WHATSAPP_CLIENT_ACK_MESSAGE =
  "Recebemos sua mensagem na InfraCode. Em breve nosso time entra em contato.";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!existsSync(INDEX_FILE)) {
  console.warn("Build files not found. Run `npm run build` before `npm run start`.");
}

const sendJson = (res, statusCode, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
};

const sendText = (res, statusCode, message) => {
  res.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "content-length": Buffer.byteLength(message),
  });
  res.end(message);
};

const sanitizePhone = (value) => value.replace(/\D/g, "");

const normalizePhoneForWhatsApp = (value) => {
  const digits = sanitizePhone(value ?? "");

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

const formatWhatsAppDisplay = (digits) => {
  if (!digits) return "WhatsApp";
  if (digits.startsWith("55") && digits.length >= 12) {
    const ddd = digits.slice(2, 4);
    const first = digits.slice(4, 9);
    const second = digits.slice(9);
    return `+55 (${ddd}) ${first}-${second}`;
  }
  return `+${digits}`;
};

const getPublicContactConfig = () => {
  const contactEmail = (process.env.SITE_CONTACT_EMAIL ?? "contato@infracode.tech").trim();
  const whatsappNumber = sanitizePhone(process.env.SITE_WHATSAPP_NUMBER ?? "5568999999999");
  const whatsappMessage = (
    process.env.SITE_WHATSAPP_MESSAGE ?? DEFAULT_WHATSAPP_MESSAGE
  ).trim();
  const instagramUrl = (process.env.SITE_INSTAGRAM_URL ?? DEFAULT_INSTAGRAM_URL).trim();
  const jurisPocketUrl = (process.env.SITE_JURISPOCKET_URL ?? "").trim();

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}${
        whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""
      }`
    : "";

  return {
    contactEmail,
    instagramUrl,
    jurisPocketUrl,
    whatsappDisplay: formatWhatsAppDisplay(whatsappNumber),
    whatsappNumber,
    whatsappUrl,
  };
};

const getWhatsAppRuntimeConfig = () => {
  const accessToken = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN?.trim() ?? "";
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID?.trim() ?? "";
  const ownerNumber = normalizePhoneForWhatsApp(process.env.WHATSAPP_NOTIFY_TO ?? "");
  const clientAckEnabled =
    (process.env.WHATSAPP_SEND_CLIENT_ACK ?? "true").trim().toLowerCase() !== "false";
  const clientAckMessage = (
    process.env.WHATSAPP_CLIENT_ACK_MESSAGE ?? DEFAULT_WHATSAPP_CLIENT_ACK_MESSAGE
  ).trim();
  const clientAckTemplateName =
    process.env.WHATSAPP_CLIENT_ACK_TEMPLATE_NAME?.trim() ?? "";
  const clientAckTemplateLanguage =
    process.env.WHATSAPP_CLIENT_ACK_TEMPLATE_LANG?.trim() || "pt_BR";

  return {
    accessToken,
    clientAckEnabled,
    clientAckMessage,
    clientAckTemplateLanguage,
    clientAckTemplateName,
    configured: Boolean(accessToken && phoneNumberId),
    ownerNumber,
    phoneNumberId,
  };
};

const getSafePath = (rawPath) => {
  const withoutLeadingSlash = rawPath.replace(/^[/\\]+/, "");
  const normalizedPath = path
    .normalize(withoutLeadingSlash)
    .replace(/^(\.\.[/\\])+/, "");
  return path.join(DIST_DIR, normalizedPath);
};

const readRequestBody = async (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;

      if (size > MAX_BODY_SIZE) {
        reject(Object.assign(new Error("Payload too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }

      chunks.push(chunk);
    });

    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });

const parseContactPayload = async (req) => {
  const rawBody = await readRequestBody(req);
  const data = rawBody ? JSON.parse(rawBody) : {};

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const phoneRaw = typeof data.phone === "string" ? data.phone.trim() : "";
  const phoneDigits = sanitizePhone(phoneRaw);
  const phone = normalizePhoneForWhatsApp(phoneRaw);
  const message = typeof data.message === "string" ? data.message.trim() : "";

  const errors = [];

  if (name.length < 2 || name.length > 120) {
    errors.push("Informe um nome valido.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Informe um e-mail valido.");
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.push("Informe um WhatsApp valido com DDD.");
  }

  if (message.length < 10 || message.length > 2000) {
    errors.push("A mensagem precisa ter entre 10 e 2000 caracteres.");
  }

  return {
    data: { name, email, phone, message },
    errors,
  };
};

const sendContactToWebhook = async (contact) => {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    return { configured: false, delivered: false, provider: "webhook" };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      source: "infracode-website",
      timestamp: new Date().toISOString(),
      ...contact,
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook responded with status ${response.status}`);
  }

  return { configured: true, delivered: true, provider: "webhook" };
};

const sendContactWithBaileysApi = async (contact) => {
  const apiUrlRaw = process.env.WHATSAPP_BAILEYS_API_URL?.trim();
  const apiKey = process.env.WHATSAPP_BAILEYS_API_KEY?.trim();

  if (!apiUrlRaw || !apiKey) {
    return {
      configured: false,
      errors: [],
      clientSent: false,
      internalSent: false,
      provider: "baileys-api",
    };
  }

  const apiUrl = apiUrlRaw.replace(/\/+$/, "");
  const response = await fetch(`${apiUrl}/lead`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Baileys API responded with status ${response.status}: ${errorText}`,
    );
  }

  const payload = await response.json().catch(() => null);
  const data = payload && typeof payload === "object" && "data" in payload ? payload.data : null;

  return {
    configured: true,
    errors:
      data && typeof data === "object" && "errors" in data && Array.isArray(data.errors)
        ? data.errors
        : [],
    clientSent:
      data && typeof data === "object" && "clientSent" in data
        ? Boolean(data.clientSent)
        : false,
    internalSent:
      data && typeof data === "object" && "internalSent" in data
        ? Boolean(data.internalSent)
        : false,
    provider: "baileys-api",
  };
};

const sendContactWithResend = async (contact, publicConfig) => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_EMAIL_FROM?.trim();
  const to = (process.env.CONTACT_EMAIL_TO?.trim() || publicConfig.contactEmail).trim();

  if (!apiKey || !from || !to) {
    return { configured: false, delivered: false, provider: "resend" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: contact.email,
      subject: `[InfraCode] Novo contato de ${contact.name}`,
      text: [
        "Novo contato recebido pelo site da InfraCode.",
        "",
        `Nome: ${contact.name}`,
        `Email: ${contact.email}`,
        `Telefone/WhatsApp: ${contact.phone}`,
        "",
        "Mensagem:",
        contact.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend responded with status ${response.status}: ${errorText}`);
  }

  return { configured: true, delivered: true, provider: "resend" };
};

const sendWhatsAppTextMessage = async (runtimeConfig, to, text) => {
  const response = await fetch(
    `https://graph.facebook.com/v22.0/${runtimeConfig.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${runtimeConfig.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: text,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `WhatsApp API responded with status ${response.status}: ${errorText}`,
    );
  }
};

const sendWhatsAppTemplateMessage = async (
  runtimeConfig,
  to,
  templateName,
  languageCode,
) => {
  const response = await fetch(
    `https://graph.facebook.com/v22.0/${runtimeConfig.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${runtimeConfig.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `WhatsApp template API responded with status ${response.status}: ${errorText}`,
    );
  }
};

const sendWhatsAppNotifications = async (contact) => {
  const runtimeConfig = getWhatsAppRuntimeConfig();

  if (!runtimeConfig.configured) {
    return {
      configured: false,
      errors: [],
      clientSent: false,
      internalSent: false,
      provider: "whatsapp",
    };
  }

  const errors = [];
  let internalSent = false;
  let clientSent = false;

  if (runtimeConfig.ownerNumber) {
    try {
      await sendWhatsAppTextMessage(
        runtimeConfig,
        runtimeConfig.ownerNumber,
        [
          "Novo contato pelo site da InfraCode",
          "",
          `Nome: ${contact.name}`,
          `Email: ${contact.email}`,
          `WhatsApp: ${contact.phone}`,
          "",
          "Mensagem:",
          contact.message,
        ].join("\n"),
      );
      internalSent = true;
    } catch (error) {
      errors.push("owner");
      console.error("[contact:whatsapp:owner:error]", error);
    }
  }

  if (runtimeConfig.clientAckEnabled && contact.phone) {
    try {
      if (runtimeConfig.clientAckTemplateName) {
        await sendWhatsAppTemplateMessage(
          runtimeConfig,
          contact.phone,
          runtimeConfig.clientAckTemplateName,
          runtimeConfig.clientAckTemplateLanguage,
        );
      } else {
        await sendWhatsAppTextMessage(
          runtimeConfig,
          contact.phone,
          `Oi, ${contact.name}! ${runtimeConfig.clientAckMessage}`,
        );
      }
      clientSent = true;
    } catch (error) {
      errors.push("client");
      console.error("[contact:whatsapp:client:error]", error);
    }
  }

  return {
    configured: true,
    errors,
    clientSent,
    internalSent,
    provider: "whatsapp",
  };
};

const sendStaticFile = async (res, filePath, method) => {
  const content = await readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] ?? "application/octet-stream";
  const cacheControl =
    extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable";

  res.writeHead(200, {
    "content-type": contentType,
    "cache-control": cacheControl,
    "content-length": content.length,
  });

  if (method === "HEAD") {
    res.end();
    return;
  }

  res.end(content);
};

const server = createServer(async (req, res) => {
  try {
    const method = req.method ?? "GET";
    const baseUrl = `http://${req.headers.host ?? "localhost"}`;
    const parsedUrl = new URL(req.url ?? "/", baseUrl);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    if (method === "GET" && pathname === "/health") {
      sendJson(res, 200, {
        ok: true,
        service: "infracode-site",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (method === "GET" && pathname === "/api/site-config") {
      sendJson(res, 200, {
        ok: true,
        data: getPublicContactConfig(),
      });
      return;
    }

    if (method === "POST" && pathname === "/api/contact") {
      let payload;
      try {
        payload = await parseContactPayload(req);
      } catch (error) {
        if (error instanceof SyntaxError) {
          sendJson(res, 400, { ok: false, message: "JSON invalido." });
          return;
        }

        const statusCode =
          typeof error === "object" && error !== null && "statusCode" in error
            ? error.statusCode
            : 500;

        sendJson(res, statusCode, {
          ok: false,
          message: "Nao foi possivel processar a requisicao.",
        });
        return;
      }

      if (payload.errors.length > 0) {
        sendJson(res, 422, { ok: false, errors: payload.errors });
        return;
      }

      const contact = payload.data;
      const publicConfig = getPublicContactConfig();
      let deliveryResult = null;
      let deliveryError = null;

      try {
        const resendResult = await sendContactWithResend(contact, publicConfig);
        if (resendResult.configured) {
          deliveryResult = resendResult;
        } else {
          const webhookResult = await sendContactToWebhook(contact);
          if (webhookResult.configured) {
            deliveryResult = webhookResult;
          }
        }
      } catch (error) {
        deliveryError = error;
        console.error("[contact:delivery:error]", error);
      }

      let whatsappResult = {
        configured: false,
        errors: [],
        clientSent: false,
        internalSent: false,
        provider: "none",
      };

      try {
        const baileysApiResult = await sendContactWithBaileysApi(contact);
        if (baileysApiResult.configured) {
          whatsappResult = baileysApiResult;
        } else {
          whatsappResult = await sendWhatsAppNotifications(contact);
        }
      } catch (error) {
        console.error("[contact:baileys-api:error]", error);
        whatsappResult = await sendWhatsAppNotifications(contact);
      }

      const hasConfiguredChannel = Boolean(deliveryResult?.configured) || whatsappResult.configured;
      const hasDeliveredChannel =
        Boolean(deliveryResult?.delivered) ||
        whatsappResult.internalSent ||
        whatsappResult.clientSent;

      if (!hasConfiguredChannel) {
        sendJson(res, 503, {
          ok: false,
          message:
            "Canal de envio nao configurado. Configure Resend, webhook, WhatsApp Baileys API ou WhatsApp Cloud API.",
        });
        return;
      }

      if (!hasDeliveredChannel) {
        sendJson(res, 502, {
          ok: false,
          message: "Nao foi possivel enviar a mensagem agora. Tente novamente.",
        });
        return;
      }

      console.log(
        "[contact:received]",
        JSON.stringify({
          ...contact,
          message: `${contact.message.slice(0, 200)}${
            contact.message.length > 200 ? "..." : ""
          }`,
          provider: deliveryResult?.provider ?? "none",
          deliveryError: Boolean(deliveryError),
          whatsappProvider: whatsappResult.provider,
          whatsappClientSent: whatsappResult.clientSent,
          whatsappInternalSent: whatsappResult.internalSent,
          whatsappErrors: whatsappResult.errors,
        }),
      );

      sendJson(res, 200, {
        ok: true,
        message: "Mensagem enviada com sucesso!",
      });
      return;
    }

    if (method !== "GET" && method !== "HEAD") {
      sendJson(res, 405, { ok: false, message: "Method not allowed." });
      return;
    }

    if (!existsSync(INDEX_FILE)) {
      sendText(
        res,
        503,
        "Build nao encontrado. Execute `npm run build` antes de iniciar o servidor.",
      );
      return;
    }

    const requestedPath = pathname === "/" ? "index.html" : pathname;
    const assetPath = getSafePath(requestedPath);

    if (!assetPath.startsWith(DIST_DIR)) {
      sendJson(res, 403, { ok: false, message: "Forbidden." });
      return;
    }

    try {
      const fileStats = await stat(assetPath);
      const finalPath = fileStats.isDirectory()
        ? path.join(assetPath, "index.html")
        : assetPath;
      await sendStaticFile(res, finalPath, method);
      return;
    } catch {
      if (path.extname(assetPath)) {
        sendJson(res, 404, { ok: false, message: "File not found." });
        return;
      }

      await sendStaticFile(res, INDEX_FILE, method);
    }
  } catch (error) {
    console.error("[server:error]", error);
    sendJson(res, 500, {
      ok: false,
      message: "Internal server error.",
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
