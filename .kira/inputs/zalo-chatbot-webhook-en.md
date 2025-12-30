# Feature Request Template

> Use this file as input for the `/feature` workflow

## 1. Feature Name

Zalo OA Chatbot Webhook Integration

## 2. Description

Build a Zalo OA chatbot simulation system with full features:

1. **Frontend** sends a webhook with standard Zalo OA format when a user sends a message.
2. **Backend** receives the webhook, calls Gemini API to generate a response, and returns it to the frontend.
3. Supported event type: `user_send_text` (text message).

### System Architecture

```
┌─────────────────┐      Webhook (POST)      ┌─────────────────┐      API Call      ┌─────────────────┐
│                 │  ─────────────────────►  │                 │  ───────────────►  │                 │
│    Frontend     │                          │     Backend     │                    │   Gemini API    │
│  (React/Vite)   │  ◄─────────────────────  │   (Express.js)  │  ◄───────────────  │                 │
│                 │      Bot Response        │                 │     AI Response    │                 │
└─────────────────┘                          └─────────────────┘                    └─────────────────┘
```

## 3. User Story

As a **developer**, I want **a Zalo OA chatbot simulator with standard webhook format**, so that **I can test and demo chatbot integration without needing a real Zalo OA account**.

## 4. Acceptance Criteria

- [ ] Frontend can send a webhook POST request with the correct Zalo OA format.
- [ ] Backend can receive and parse the webhook payload.
- [ ] Backend can verify the signature (X-ZEvent-Signature).
- [ ] Backend can call Gemini API and receive a response.
- [ ] Frontend can display the bot's response message.
- [ ] Typing indicator while waiting for a response.
- [ ] Handle error cases (API timeout, invalid payload, etc.).

## 5. Technical Notes

### 5.1 Zalo OA Webhook Specification

#### Request Metadata

| Field                  | Value                                            |
| ---------------------- | ------------------------------------------------ |
| **URL**                | `http://localhost:3001/webhook`                  |
| **Method**             | `POST`                                           |
| **Content-Type**       | `application/json`                               |
| **X-ZEvent-Signature** | `sha256(appId + data + timestamp + OASecretKey)` |

#### Request Body Structure

```json
{
  "app_id": "demo_app_id",
  "sender": {
    "id": "user_123456789"
  },
  "recipient": {
    "id": "oa_987654321"
  },
  "event_name": "user_send_text",
  "message": {
    "text": "User message content",
    "msg_id": "msg_abc123def456"
  },
  "timestamp": "1703920000000"
}
```

#### Field Descriptions

| Property         | Data Type | Description                                      |
| ---------------- | --------- | ------------------------------------------------ |
| `app_id`         | String    | ID of the application receiving the event        |
| `sender`         | Object    | Sender information                               |
| `sender.id`      | String    | ID of the User sending the message               |
| `recipient`      | Object    | Recipient information                            |
| `recipient.id`   | String    | ID of the Official Account receiving the message |
| `event_name`     | String    | Event type (see below)                           |
| `message`        | Object    | Message content                                  |
| `message.text`   | String    | Text content of the message                      |
| `message.msg_id` | String    | Message ID                                       |
| `timestamp`      | String    | Request timestamp (milliseconds)                 |

#### Event Types (event_name)

| Event Name                | Description                 |
| ------------------------- | --------------------------- |
| `user_send_text`          | User sends a text message   |
| `user_send_image`         | User sends an image         |
| `user_send_link`          | User sends a link           |
| `user_send_audio`         | User sends audio            |
| `user_send_video`         | User sends a video          |
| `user_send_sticker`       | User sends a sticker        |
| `user_send_location`      | User sends "their" location |
| `user_send_business_card` | User sends a business card  |
| `user_send_file`          | User sends a file           |

> **Note:** This demo only supports `user_send_text`

### 5.2 Backend Response Format

```json
{
  "success": true,
  "data": {
    "msg_id": "bot_msg_1703920001000",
    "recipient_id": "user_123456789",
    "message": {
      "text": "Response from Gemini AI"
    }
  }
}
```

### 5.3 Gemini API Integration

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

await main();
```

### 5.4 Signature Verification (X-ZEvent-Signature)

```javascript
import crypto from "crypto";

function generateSignature(appId, data, timestamp, secretKey) {
  const payload = appId + JSON.stringify(data) + timestamp + secretKey;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

function verifySignature(signature, appId, data, timestamp, secretKey) {
  const expectedSignature = generateSignature(
    appId,
    data,
    timestamp,
    secretKey
  );
  return signature === expectedSignature;
}
```

### 5.5 Proposed Directory Structure

```
ChatbotZaloSimulator/
├── backend/
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   └── src/
│       ├── index.js              # Express server entry point
│       ├── routes/
│       │   └── webhook.js        # Webhook route handler
│       ├── services/
│       │   └── gemini.js         # Gemini AI service
│       ├── middlewares/
│       │   └── verifySignature.js # Signature verification middleware
│       └── utils/
│           └── signature.js      # Signature utilities
│
├── zalo/                         # Frontend (existing)
│   └── src/
│       ├── App.jsx              # Updated with webhook integration
│       ├── services/
│       │   └── webhookService.js # Webhook client service
│       └── config/
│           └── constants.js      # Configuration constants
│
└── .env.example
```

### 5.6 Environment Variables

```bash
# Backend
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
OA_SECRET_KEY=demo_secret_key
APP_ID=demo_app_id
OA_ID=oa_987654321

# Frontend (in zalo/.env)
VITE_WEBHOOK_URL=http://localhost:3001/webhook
VITE_APP_ID=demo_app_id
VITE_USER_ID=user_123456789
VITE_OA_ID=oa_987654321
VITE_OA_SECRET_KEY=demo_secret_key
```

## 6. References

- [Zalo OA Webhook Documentation](https://developers.zalo.me/docs/official-account/webhook/tin-nhan/su-kien-nguoi-dung-gui-tin-nhan)
- [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
- [Express.js Documentation](https://expressjs.com/)

## 7. Priority

- [ ] Critical
- [x] High
- [ ] Medium
- [ ] Low

---

_Template version: 1.0_
