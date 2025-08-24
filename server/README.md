# Wiki Scribe Buddy Backend

This is the backend server for the Wiki Scribe Buddy application. It handles all API calls to Anthropic's Claude API securely.

## Features

- ✅ Secure API key management
- ✅ CORS configuration for frontend
- ✅ Rate limiting and error handling
- ✅ Health check endpoints
- ✅ Production-ready setup

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` and add your Anthropic API key:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Anthropic API Configuration
ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here

# CORS Configuration (add your frontend URLs)
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:8081,http://localhost:8082,http://localhost:8083,http://localhost:8084,http://localhost:8085

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Development

Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### 4. Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Chat API

- `POST /api/chat/message` - Send message to Claude
- `GET /api/chat/health` - Anthropic service health

### Request Format

```json
POST /api/chat/message
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful AI assistant."
    },
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "context": "Optional context information"
}
```

### Response Format

```json
{
  "content": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 15,
    "total_tokens": 40
  }
}
```

## Security Features

- **API Key Protection**: API keys are never exposed to the frontend
- **CORS Configuration**: Only allowed origins can access the API
- **Input Validation**: All requests are validated
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Rate Limiting**: Built-in rate limiting to prevent abuse

## Deployment

### Environment Variables for Production

```env
PORT=3001
NODE_ENV=production
ANTHROPIC_API_KEY=your_production_api_key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend URL is in `ALLOWED_ORIGINS`
2. **API Key Errors**: Verify your Anthropic API key is correct
3. **Port Conflicts**: Change the `PORT` in `.env` if 3001 is in use

### Health Checks

- Server health: `http://localhost:3001/health`
- Anthropic service: `http://localhost:3001/api/chat/health`

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run dev:frontend` - Start frontend dev server

### File Structure

```
server/
├── src/
│   ├── index.ts          # Main server file
│   ├── routes/
│   │   └── chat.ts       # Chat API routes
│   └── services/
│       └── anthropic.ts  # Anthropic API service
├── package.json
├── tsconfig.json
└── .env
```
