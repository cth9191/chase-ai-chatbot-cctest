// Matrix background animation
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for(let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00AAFF';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}

// Chat functionality
class ChaseAIChatbot {
    constructor() {
        this.chatWindow = document.getElementById('chatWindow');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        // Configure n8n webhook URL automatically
        this.webhookUrl = 'https://n8n.srv910413.hstgr.cloud/webhook/41f5fc5b-9d20-4152-ac5e-4fb043ea2ee3';
        
        this.initEventListeners();
        this.updateTimestamp();
        this.simulateLatency();
        this.initializeConnection();
    }
    
    initEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Auto-focus input
        this.messageInput.focus();
    }
    
    updateTimestamp() {
        const timestampElement = document.getElementById('timestamp');
        const now = new Date();
        timestampElement.textContent = now.toLocaleTimeString();
        setInterval(() => {
            const now = new Date();
            timestampElement.textContent = now.toLocaleTimeString();
        }, 1000);
    }
    
    simulateLatency() {
        const latencyElement = document.getElementById('latency');
        setInterval(() => {
            const latency = Math.floor(Math.random() * 20) + 8;
            latencyElement.textContent = `${latency}ms`;
        }, 5000);
    }
    
    initializeConnection() {
        // Display connection status
        this.addMessage('Connecting to Chase AI n8n backend...', false, true);
        setTimeout(() => {
            this.addMessage('✓ Connected to n8n AI agent. Ready for interaction!', false, true);
        }, 1000);
    }
    
    addMessage(content, isUser = false, isSystem = false) {
        const messageDiv = document.createElement('div');
        
        if (isSystem) {
            messageDiv.className = 'system-message';
            messageDiv.innerHTML = `
                <span class="timestamp">[SYSTEM]</span>
                <span class="message">${content}</span>
            `;
        } else {
            messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
            messageDiv.innerHTML = `
                <div class="timestamp">[${new Date().toLocaleTimeString()}]</div>
                <div>${content}</div>
            `;
        }
        
        this.chatWindow.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <span>[CHASE AI]</span>
            <span>Processing</span>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.chatWindow.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, true);
        this.messageInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            if (this.webhookUrl) {
                // Send to actual webhook
                await this.sendToWebhook(message);
            } else {
                // Simulate response when no webhook is configured
                await this.simulateResponse(message);
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage(`Error: ${error.message || 'Unable to connect to Chase AI n8n backend. Please check your connection and try again.'}`, false, true);
        }
    }
    
    async sendToWebhook(message) {
        try {
            // Build URL with query parameters for GET request
            const url = new URL(this.webhookUrl);
            url.searchParams.append('message', message);
            url.searchParams.append('timestamp', new Date().toISOString());
            url.searchParams.append('user', 'terminal_user');
            
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.hideTypingIndicator();
            
            // Handle n8n response format: [{"text": "response"}] or {"text": "response"}
            if (Array.isArray(data) && data.length > 0 && data[0].text) {
                this.addMessage(data[0].text);
            } else if (data.text) {
                this.addMessage(data.text);
            } else if (data.response) {
                this.addMessage(data.response);
            } else if (data.message) {
                this.addMessage(data.message);
            } else if (data.output) {
                this.addMessage(data.output);
            } else if (typeof data === 'string') {
                this.addMessage(data);
            } else {
                this.addMessage('Chase AI processed your request successfully.');
            }
        } catch (error) {
            console.error('Webhook error:', error);
            throw new Error(`Failed to connect to Chase AI: ${error.message}`);
        }
    }
    
    async simulateResponse(message) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        this.hideTypingIndicator();
        
        // Simple response simulation
        const responses = [
            `Processing query: "${message}"...`,
            `I understand you're asking about "${message}". Currently running in demo mode.`,
            `Query received: "${message}". Webhook integration pending.`,
            `Analyzing: "${message}". Full AI capabilities will be available once webhook is configured.`,
            `Demo response for: "${message}". Ready for n8n integration.`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage(randomResponse);
    }
    
    // Method to configure webhook (will be called when user provides webhook URL)
    setWebhook(url) {
        this.webhookUrl = url;
        this.addMessage(`Webhook configured: ${url}`, false, true);
        this.addMessage('Chase AI is now connected and ready for full interaction.', false, true);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    window.chatbot = new ChaseAIChatbot();
});

// Handle window resize for matrix background
window.addEventListener('resize', () => {
    const canvas = document.getElementById('matrix-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Terminal commands (bonus feature)
const terminalCommands = {
    help: () => "Available commands: help, status, clear, about",
    status: () => "System Status: ONLINE | Neural Network: ACTIVE | Webhook: " + (window.chatbot.webhookUrl ? "CONNECTED" : "PENDING"),
    clear: () => {
        document.getElementById('chatWindow').innerHTML = `
            <div class="system-message">
                <span class="timestamp">[SYSTEM]</span>
                <span class="message">Terminal cleared.</span>
            </div>
        `;
        return "";
    },
    about: () => "Chase AI Chatbot Terminal v2.0 - Matrix-themed interface for AI interaction"
};

// Check for terminal commands
const originalSendMessage = ChaseAIChatbot.prototype.sendMessage;
ChaseAIChatbot.prototype.sendMessage = function() {
    const message = this.messageInput.value.trim();
    
    if (message.startsWith('/')) {
        const command = message.slice(1).toLowerCase();
        if (terminalCommands[command]) {
            this.addMessage(message, true);
            this.messageInput.value = '';
            const response = terminalCommands[command]();
            if (response) {
                setTimeout(() => this.addMessage(response, false, true), 500);
            }
            return;
        }
    }
    
    originalSendMessage.call(this);
};