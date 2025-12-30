# Zalo OA Chatbot Webhook Simulator

A full-stack simulator for Zalo Official Account (OA) chatbot webhook integration. This application enables developers to test and demo chatbot functionality without requiring a real Zalo OA account, using Google Gemini AI for intelligent responses.

## Features

- **Zalo-like Chat Interface**: A React-based UI that simulates the Zalo messaging experience
- **Webhook Server**: Express.js backend with Zalo OA webhook compatibility
- **AI-Powered Responses**: Integration with Google Gemini AI for intelligent chat responses
- **Signature Verification**: SHA256 HMAC signature verification for secure webhook communication
- **Real-time Typing Indicators**: Visual feedback for bot response states
- **Error Handling**: Comprehensive error handling and user-friendly error messages

## Architecture

```
chatbot-zalo-simulator/
├── backend/                 # Express.js webhook server
│   ├── src/
│   │   ├── index.js        # Server entry point
│   │   ├── config/         # Environment configuration
│   │   ├── middlewares/    # Signature verification, error handling
│   │   ├── routes/         # Webhook endpoint handler
│   │   ├── services/       # Gemini AI integration
│   │   └── utils/          # Signature utilities
│   └── package.json
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API client services
│   ├── utils/             # Frontend utilities
│   └── config/            # Frontend configuration
└── package.json
```

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Google Gemini API Key

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ChatbotZaloSimulator
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend && npm install
   ```

4. **Configure environment variables**:

   **Frontend (.env)**:
   ```bash
   VITE_WEBHOOK_URL=http://localhost:3001/webhook
   VITE_APP_ID=demo_app_id
   VITE_USER_ID=demo_user_123
   VITE_OA_ID=demo_oa_987
   VITE_SECRET_KEY=demo_secret_key_change_in_production
   ```

   **Backend (backend/.env)**:
   ```bash
   PORT=3001
   NODE_ENV=development
   OA_APP_ID=demo_app_id
   OA_SECRET_KEY=demo_secret_key_change_in_production
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.0-flash-exp
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Get a Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to `backend/.env`

## Usage

### Development Mode

Run both frontend and backend:

```bash
# Run both together (recommended)
npm run dev:all

# Or run separately
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend Health**: http://localhost:3001/health
- **Webhook Endpoint**: http://localhost:3001/webhook

## API Reference

### POST /webhook

Receives Zalo OA format webhook and returns AI-generated response.

**Request Headers**:
```
Content-Type: application/json
X-ZEvent-Signature: sha256=<signature>
```

**Request Body**:
```json
{
  "app_id": "demo_app_id",
  "sender": { "id": "user_123" },
  "recipient": { "id": "oa_987" },
  "event_name": "user_send_text",
  "message": {
    "text": "Hello, how are you?",
    "msg_id": "msg_123"
  },
  "timestamp": "1703920000000"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "msg_id": "bot_msg_1703920001000",
    "recipient_id": "user_123",
    "message": {
      "text": "Hello! I'm doing well, thank you for asking!"
    }
  }
}
```

**Error Responses**:
- `400`: Invalid payload
- `401`: Missing signature
- `403`: Invalid signature
- `500`: Internal server error

### GET /health

Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600
}
```

## Configuration

### Frontend Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `VITE_WEBHOOK_URL` | string | Required | Webhook endpoint URL |
| `VITE_APP_ID` | string | Required | Zalo OA App ID |
| `VITE_USER_ID` | string | Required | User ID for simulation |
| `VITE_OA_ID` | string | Required | Official Account ID |
| `VITE_SECRET_KEY` | string | Required | Secret key for signature |

### Backend Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `PORT` | number | 3001 | Server port |
| `NODE_ENV` | string | development | Environment mode |
| `OA_APP_ID` | string | Required | Zalo OA App ID |
| `OA_SECRET_KEY` | string | Required | Secret key for signature verification |
| `GEMINI_API_KEY` | string | Required | Google Gemini API key |
| `GEMINI_MODEL` | string | gemini-2.0-flash-exp | Gemini model to use |
| `CORS_ORIGIN` | string | http://localhost:5173 | CORS allowed origin |

## Security Notes

- **Signature Verification**: Uses SHA256 HMAC for webhook signature verification
- **Environment Variables**: All secrets stored in `.env` files (not committed)
- **CORS**: Configured for development origin
- **Helmet**: Security headers middleware enabled

**Important**: For production deployment:
1. Use HTTPS for all webhook communication
2. Store secret keys using a secure secrets manager
3. Enable rate limiting on webhook endpoints
4. Enable Content Security Policy
5. Implement request logging and monitoring

## Known Limitations

1. **No Message Persistence**: Chat history is stored in memory and lost on page refresh
2. **Gemini API Key Required**: Users must provide their own Google Gemini API key
3. **Development Mode Only**: Uses HTTP; production should use HTTPS

## Future Enhancements

- Message history persistence (localStorage/database)
- File upload support (images/documents)
- Quick reply buttons
- Multi-language support (English/Vietnamese)
- Dark/light theme toggle
- Export chat functionality
- Mock mode without AI key

## Technology Stack

### Frontend
- React 18
- Vite
- Vanilla CSS

### Backend
- Express.js
- Google Generative AI (@google/generative-ai)
- CORS
- Helmet
- dotenv

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
