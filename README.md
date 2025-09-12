# Chase AI Chatbot - Matrix Terminal Interface

A Matrix-themed terminal interface for the Chase AI Chatbot with n8n webhook integration.

## Features

- **Matrix-style background animation** with falling green characters
- **Terminal-themed UI** with authentic command-line aesthetics
- **Real-time chat interface** with typing indicators
- **Webhook integration ready** for n8n chatbot connection
- **Responsive design** that works on desktop and mobile
- **Built-in terminal commands** for system interaction

## Files

- `index.html` - Main HTML structure
- `style.css` - Matrix terminal styling and animations
- `script.js` - Chat functionality and Matrix background

## Terminal Commands

- `/help` - Show available commands
- `/status` - Display system status
- `/clear` - Clear chat window
- `/about` - Show version information

## Webhook Integration

To connect your n8n chatbot:

1. Get your n8n webhook URL
2. Use the JavaScript method: `window.chatbot.setWebhook('YOUR_WEBHOOK_URL')`

Expected webhook payload:
```json
{
  "message": "user message",
  "timestamp": "2025-09-12T...",
  "user": "terminal_user"
}
```

Expected response format:
```json
{
  "response": "AI chatbot response"
}
```

## Demo Mode

When no webhook is configured, the interface runs in demo mode with simulated responses.

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers