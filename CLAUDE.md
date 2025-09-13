# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Matrix-style terminal chat interface that integrates with n8n AI workflows via webhook. The project is a pure frontend application using vanilla HTML, CSS, and JavaScript with no build process required.

**Live Deployment**: https://chase-ai-chatbot-cctest.vercel.app
**Repository**: https://github.com/cth9191/chase-ai-chatbot-cctest

## Key Development Commands

### Local Testing
```bash
# Start local development server (required for webhook testing due to CORS)
python -m http.server 8000
# Then access: http://localhost:8000
```

### Deployment
```bash
# Deploy to Vercel (automated pipeline configured)
# Option 1: Interactive login (browser-based)
# vercel login
# vercel --prod --yes

# Option 2: Token-based (for automation) 
# Store token in local environment variable or .vercel-token file
# vercel --prod --token $(cat .vercel-token) --yes
```

### Version Control
```bash
# Standard git workflow - all changes should be committed
git add .
git commit -m "Description of changes"
git push origin main
```

## Architecture & Code Structure

### Core Components

**HTML Structure (`index.html`)**:
- Single-page application with semantic structure
- Matrix canvas background, terminal header, chat window, input container, and footer
- Uses Courier Prime font from Google Fonts for monospace terminal aesthetic

**Styling (`style.css`)**:
- **Blue Matrix Theme**: Primary color scheme uses `#00aaff`, `#0099dd`, `#0088cc`
- **Responsive Design**: Flexbox-based layout with mobile breakpoints at 768px
- **Terminal Effects**: Blinking cursor, glowing borders, backdrop blur, typing animations
- **Custom Scrollbars**: Styled to match the blue theme

**JavaScript Functionality (`script.js`)**:
- **Matrix Animation**: Canvas-based falling character background animation
- **ChaseAIChatbot Class**: Main chat functionality with n8n webhook integration
- **Terminal Commands**: Built-in commands (`/help`, `/status`, `/clear`, `/about`)
- **Response Parsing**: Handles multiple n8n response formats

### Integration Architecture

**n8n Webhook Integration**:
- **Current Webhook**: `https://n8n.srv910413.hstgr.cloud/webhook/41f5fc5b-9d20-4152-ac5e-4fb043ea2ee3`
- **Method**: GET requests with query parameters (`message`, `timestamp`, `user`)
- **Response Formats Supported**: `{text: "..."}`, `{response: "..."}`, `{message: "..."}`, `{output: "..."}`, or plain string

**Auto-Connection Flow**:
1. Page loads and initializes Matrix background
2. ChaseAIChatbot class auto-instantiates with webhook URL
3. Connection status messages display in chat
4. Chat interface becomes fully interactive

### Key Implementation Details

**Message Flow**:
- User input → `sendMessage()` → `sendToWebhook()` → n8n processing → response parsing → UI update
- Typing indicators and timestamps added automatically
- Error handling with fallback messages

**Terminal Command System**:
- Commands prefixed with `/` are intercepted before webhook sending
- Extensible via `terminalCommands` object in script.js
- Responses display as system messages

**Theme Customization**:
- All colors centralized in CSS custom properties equivalent
- Matrix animation colors defined in JavaScript (line 24: `ctx.fillStyle = '#00AAFF'`)
- Easy theme switching by updating color variables

## Development Patterns

### Adding New Features
1. **UI Changes**: Modify HTML structure and CSS styling as needed
2. **Functionality**: Extend ChaseAIChatbot class methods
3. **Testing**: Use Python HTTP server for CORS-free testing
4. **Deployment**: Single command via Vercel CLI

### Webhook Configuration
- Current webhook is hardcoded in `script.js` line 48
- To change: Update `this.webhookUrl` in ChaseAIChatbot constructor
- Dynamic webhook setting available via `window.chatbot.setWebhook(url)` method

### Message Format Handling
The response parser in `sendToWebhook()` handles multiple n8n output formats:
- Array format: `[{"text": "response"}]`
- Object format: `{"text": "response"}`
- Alternative keys: `response`, `message`, `output`
- Fallback to plain string or default message

### Browser Compatibility
- **Recommended**: Chrome/Edge for optimal Canvas and CSS effects
- **Supported**: Firefox, Safari, mobile browsers
- **Dependencies**: Google Fonts (Courier Prime), modern ES6+ features

## Production Considerations

**Performance**:
- No build process or bundling required
- Matrix animation optimized with 35ms interval
- Responsive design handles mobile and desktop

**Security**:
- Uses GET requests to avoid CORS preflight issues
- No sensitive data stored client-side
- Webhook URL could be environment-ized if needed

**Maintenance**:
- Production code has console.log statements removed
- Error logging via console.error maintained
- Automated deployment prevents manual errors