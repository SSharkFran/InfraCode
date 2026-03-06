const REQUEST_TIMEOUT_MS = 15000;

type ContactResponsePayload = {
  message?: string;
  errors?: string[];
};

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const resolveBackendUrl = () => {
  const rawUrl = String(
    import.meta.env.VITE_BACKEND_URL ?? import.meta.env.REACT_APP_BACKEND_URL ?? "",
  ).trim();

  return rawUrl.replace(/\/+$/, "");
};

const buildContactEndpoint = () => {
  const baseUrl = resolveBackendUrl();
  return baseUrl ? `${baseUrl}/api/contact` : "/api/contact";
};

const extractErrorMessage = (
  payload: ContactResponsePayload | null,
  fallbackMessage: string,
) => {
  return payload?.errors?.join(" ") || payload?.message || fallbackMessage;
};

export const submitContact = async (
  payload: ContactPayload,
): Promise<ContactResponsePayload | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(buildContactEndpoint(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const responsePayload = (await response.json().catch(() => null)) as
      | ContactResponsePayload
      | null;

    if (!response.ok) {
      throw new Error(
        extractErrorMessage(
          responsePayload,
          "Nao foi possivel enviar sua mensagem agora.",
        ),
      );
    }

    return responsePayload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "Tempo de resposta excedido. Verifique sua conexao e tente novamente.",
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Nao foi possivel conectar ao servidor. Tente novamente em instantes.",
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Falha inesperada ao enviar a mensagem.");
  } finally {
    clearTimeout(timeoutId);
  }
};
