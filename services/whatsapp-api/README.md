# InfraCode WhatsApp API (Baileys)

API separada para envio de mensagens via WhatsApp Web usando Baileys.

## Endpoints

- `GET /health`: status simples.
- `GET /session/status`: status da sessao (`x-api-key`).
- `GET /session/qr`: QR atual para login (`x-api-key`).
- `POST /session/reconnect`: reconecta a sessao (`x-api-key`).
- `POST /messages/text`: envia mensagem (`x-api-key`).
- `POST /lead`: envia lead para numero interno e confirmacao para cliente (`x-api-key`).

## Variaveis

Use o arquivo `.env.example` como base.

Obrigatorias:

- `API_KEY`

Recomendadas:

- `AUTH_DIR` (persistir com volume no Railway)
- `OWNER_NOTIFY_TO`
- `CLIENT_ACK_ENABLED`
- `CLIENT_ACK_TEXT`

## Execucao local

```sh
npm install
npm run dev
```

## Deploy Railway (servico separado)

1. Crie um novo service apontando para o subdiretorio `services/whatsapp-api`.
2. Build command: `npm install`
3. Start command: `npm run start`
4. Configure variaveis de ambiente.
5. Adicione volume para persistir `AUTH_DIR` (ex.: `/data/.baileys_auth`).

Observacao: o `nixpacks.toml` deste diretorio ja define setup/install/start.

## Fluxo inicial de login

1. Suba o service.
2. Chame `GET /session/qr` com `x-api-key`.
3. Escaneie o QR com o WhatsApp.
4. Confirme em `GET /session/status` que `connected=true`.
