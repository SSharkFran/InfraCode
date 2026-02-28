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

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}${
        whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""
      }`
    : "";

  return {
    contactEmail,
    instagramUrl,
    whatsappDisplay: formatWhatsAppDisplay(whatsappNumber),
    whatsappNumber,
    whatsappUrl,
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
  const message = typeof data.message === "string" ? data.message.trim() : "";

  const errors = [];

  if (name.length < 2 || name.length > 120) {
    errors.push("Informe um nome valido.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Informe um e-mail valido.");
  }

  if (message.length < 10 || message.length > 2000) {
    errors.push("A mensagem precisa ter entre 10 e 2000 caracteres.");
  }

  return {
    data: { name, email, message },
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
        console.error("[contact:delivery:error]", error);
        sendJson(res, 502, {
          ok: false,
          message: "Nao foi possivel enviar a mensagem agora. Tente novamente.",
        });
        return;
      }

      if (!deliveryResult?.configured) {
        sendJson(res, 503, {
          ok: false,
          message:
            "Canal de envio nao configurado. Configure RESEND_API_KEY/CONTACT_EMAIL_FROM ou CONTACT_WEBHOOK_URL.",
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
          provider: deliveryResult.provider,
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
