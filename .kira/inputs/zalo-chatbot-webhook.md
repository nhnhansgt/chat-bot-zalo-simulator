# Feature Request Template

> Use this file as input for the `/feature` workflow

## 1. Feature Name

Zalo OA Chatbot Webhook Integration

## 2. Description

Xây dựng hệ thống demo giả lập chatbot Zalo OA với đầy đủ tính năng:

1. **Frontend** gửi webhook với format chuẩn của Zalo OA khi user gửi tin nhắn
2. **Backend** nhận webhook, gọi Gemini API để generate response và trả về cho frontend
3. Hỗ trợ event type: `user_send_text` (tin nhắn văn bản)

### Kiến trúc hệ thống

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

- [ ] Frontend gửi được webhook POST request với đúng format Zalo OA
- [ ] Backend nhận và parse được webhook payload
- [ ] Backend verify được signature (X-ZEvent-Signature)
- [ ] Backend gọi được Gemini API và nhận response
- [ ] Frontend hiển thị được tin nhắn phản hồi từ bot
- [ ] Có typing indicator khi đang chờ response
- [ ] Xử lý được error cases (API timeout, invalid payload, etc.)

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
    "text": "Nội dung tin nhắn người dùng",
    "msg_id": "msg_abc123def456"
  },
  "timestamp": "1703920000000"
}
```

#### Field Descriptions

| Thuộc tính       | Kiểu dữ liệu | Mô tả                                 |
| ---------------- | ------------ | ------------------------------------- |
| `app_id`         | String       | ID của ứng dụng đang nhận sự kiện     |
| `sender`         | Object       | Thông tin người gửi                   |
| `sender.id`      | String       | ID của User gửi tin nhắn              |
| `recipient`      | Object       | Thông tin người nhận                  |
| `recipient.id`   | String       | ID của Official Account nhận tin nhắn |
| `event_name`     | String       | Loại event (xem bên dưới)             |
| `message`        | Object       | Nội dung tin nhắn                     |
| `message.text`   | String       | Nội dung văn bản tin nhắn             |
| `message.msg_id` | String       | ID của tin nhắn                       |
| `timestamp`      | String       | Thời điểm request (milliseconds)      |

#### Event Types (event_name)

| Event Name                | Mô tả                           |
| ------------------------- | ------------------------------- |
| `user_send_text`          | Người dùng gửi tin nhắn văn bản |
| `user_send_image`         | Người dùng gửi hình ảnh         |
| `user_send_link`          | Người dùng gửi liên kết         |
| `user_send_audio`         | Người dùng gửi âm thanh         |
| `user_send_video`         | Người dùng gửi video            |
| `user_send_sticker`       | Người dùng gửi sticker          |
| `user_send_location`      | Người dùng gửi vị trí           |
| `user_send_business_card` | Người dùng gửi danh thiếp       |
| `user_send_file`          | Người dùng gửi file             |

> **Note:** Demo này chỉ support `user_send_text`

### 5.2 Backend Response Format

```json
{
  "success": true,
  "data": {
    "msg_id": "bot_msg_1703920001000",
    "recipient_id": "user_123456789",
    "message": {
      "text": "Phản hồi từ Gemini AI"
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
