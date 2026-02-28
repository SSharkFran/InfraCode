# InfraCode - Website Institucional

Site institucional em React + Vite, com servidor Node para deploy no Railway.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS

## Scripts

```sh
npm run dev      # desenvolvimento (Vite)
npm run build    # gera dist/
npm run start    # servidor de producao (serve dist + API)
npm run test     # testes unitarios
npm run lint     # lint
```

## API de Contato

Endpoint de formulario:

```http
POST /api/contact
Content-Type: application/json
```

Payload:

```json
{
  "name": "Seu nome",
  "email": "email@dominio.com",
  "phone": "5568999999999",
  "message": "Sua mensagem"
}
```

Comportamento:

- Valida nome, email, WhatsApp e mensagem.
- Retorna erro `422` para dados invalidos.
- Envia pela API da Resend quando `RESEND_API_KEY` e `CONTACT_EMAIL_FROM` estiverem configuradas.
- Se Resend nao estiver configurado, usa `CONTACT_WEBHOOK_URL` como fallback.
- Recomendado: integra com API separada em Baileys (`WHATSAPP_BAILEYS_API_URL`).
- Opcionalmente usa WhatsApp Cloud API (Meta) como fallback.
- Para confirmacao automatica ao cliente, pode usar texto simples ou template aprovado.
- Se nenhum canal estiver configurado, retorna `503`.

Endpoint para dados publicos de contato (lidos de variaveis de ambiente):

```http
GET /api/site-config
```

## Deploy no Railway

1. Conecte o repositorio no Railway.
2. Railway vai instalar dependencias e executar `npm run build`.
3. Configure o start command como `npm run start` (se necessario).
4. Deploy.

Observacao: o arquivo `nixpacks.toml` ja fixa setup/install/build/start para este projeto.

Variaveis de ambiente opcionais:

- `SITE_CONTACT_EMAIL`: email exibido na secao de contato.
- `SITE_WHATSAPP_NUMBER`: numero com DDI+DDD (ex.: `5568999999999`).
- `SITE_WHATSAPP_MESSAGE`: texto pre-preenchido no link do WhatsApp.
- `SITE_INSTAGRAM_URL`: URL do Instagram da empresa.
- `SITE_JURISPOCKET_URL`: URL publica do JurisPocket para botao "Ver online".
- `RESEND_API_KEY`: chave da Resend para envio de email.
- `CONTACT_EMAIL_FROM`: remetente validado na Resend (ex.: `site@seudominio.com`).
- `CONTACT_EMAIL_TO`: destinatario dos leads (se vazio, usa `SITE_CONTACT_EMAIL`).
- `CONTACT_WEBHOOK_URL`: fallback para envio via webhook.
- `WHATSAPP_BAILEYS_API_URL`: URL da API separada em `services/whatsapp-api`.
- `WHATSAPP_BAILEYS_API_KEY`: chave de autenticacao dessa API.
- `WHATSAPP_CLOUD_ACCESS_TOKEN`: token da API Cloud do WhatsApp (Meta).
- `WHATSAPP_CLOUD_PHONE_NUMBER_ID`: ID do numero da conta WhatsApp Business.
- `WHATSAPP_NOTIFY_TO`: seu numero pessoal para receber aviso de novo lead.
- `WHATSAPP_SEND_CLIENT_ACK`: `true/false` para enviar confirmacao ao cliente.
- `WHATSAPP_CLIENT_ACK_MESSAGE`: mensagem de confirmacao automatica ao cliente.
- `WHATSAPP_CLIENT_ACK_TEMPLATE_NAME`: template aprovado na Meta (opcional, recomendado).
- `WHATSAPP_CLIENT_ACK_TEMPLATE_LANG`: idioma do template (ex.: `pt_BR`).
- `PORT`: fornecida automaticamente pelo Railway.
- Arquivo de referencia: `.env.example`

Observacao sobre WhatsApp: para envios fora da janela de 24h, a Meta pode exigir templates aprovados.

API separada (Baileys): veja [services/whatsapp-api/README.md](./services/whatsapp-api/README.md).

Healthcheck:

- `GET /health`

## Ambiente Local

Requisitos:

- Node.js 18+
- npm

Executar:

```sh
npm install
npm run dev
```
