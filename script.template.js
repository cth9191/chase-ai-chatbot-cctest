// Matrix background animation with performance optimizations
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    // Optimize canvas for performance
    ctx.willReadFrequently = false;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}CHASE.AI";
    const matrixArray = matrix.split("");
    
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops = [];
    for(let x = 0; x < columns; x++) {
        drops[x] = Math.floor(Math.random() * canvas.height / fontSize);
    }
    
    let lastTime = 0;
    const frameInterval = 50; // Limit to ~20 FPS for better performance
    
    function draw(currentTime) {
        if (currentTime - lastTime < frameInterval) {
            requestAnimationFrame(draw);
            return;
        }
        lastTime = currentTime;
        
        // Create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text properties
        ctx.fillStyle = '#00AAFF';
        ctx.font = fontSize + 'px monospace';
        ctx.textBaseline = 'top';
        
        // Draw matrix characters
        for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            // Add slight glow effect to some characters
            if (Math.random() > 0.98) {
                ctx.shadowColor = '#00AAFF';
                ctx.shadowBlur = 5;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.fillText(text, x, y);
            
            // Reset drop when it goes off screen
            if(y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        requestAnimationFrame(draw);
    }
    
    requestAnimationFrame(draw);
    
    // Handle resize
    return resizeCanvas;
}

// Chat functionality
class ChaseAIChatbot {
    constructor() {
        this.chatWindow = document.getElementById('chatWindow');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        // Configure n8n webhook URL - check for environment variable or fallback to demo
        this.webhookUrl = null;
        this.loadWebhookUrl();
        
        this.initEventListeners();
        this.updateTimestamp();
        this.simulateLatency();
        this.initializeConnection();
    }
    
    async loadWebhookUrl() {
        const configuredUrl = '__WEBHOOK_URL_PLACEHOLDER__';
        
        if (configuredUrl && configuredUrl !== 'DEMO_MODE' && configuredUrl !== '__WEBHOOK_URL_PLACEHOLDER__') {
            this.webhookUrl = configuredUrl;
            console.log('Webhook URL loaded from build configuration.');
            return;
        }
        
        try {
            // Fallback to local file (development)
            const response = await fetch('.webhook-url');
            if (response.ok) {
                this.webhookUrl = (await response.text()).trim();
                console.log('Webhook URL loaded from local file.');
                return;
            }
        } catch (error) {
            console.log('Local webhook file not found.');
        }
        
        console.log('No webhook URL configured. Running in demo mode.');
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
    
    addMessage(content, isUser = false, isSystem = false, messageType = 'normal') {
        const messageDiv = document.createElement('div');
        
        if (isSystem) {
            messageDiv.className = 'system-message';
            if (messageType === 'error') messageDiv.classList.add('error-message');
            if (messageType === 'success') messageDiv.classList.add('success-message');
            if (messageType === 'warning') messageDiv.classList.add('warning-message');
            
            messageDiv.innerHTML = `
                <span class="timestamp">[SYSTEM]</span>
                <span class="message">${content}</span>
            `;
        } else {
            messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
            messageDiv.setAttribute('role', 'article');
            messageDiv.setAttribute('aria-label', isUser ? 'Your message' : 'Chase AI response');
            
            messageDiv.innerHTML = `
                <div class="timestamp">[${new Date().toLocaleTimeString()}]</div>
                <div>${content}</div>
            `;
        }
        
        this.chatWindow.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Auto-remove error messages after 10 seconds
        if (messageType === 'error') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.opacity = '0';
                    setTimeout(() => messageDiv.remove(), 300);
                }
            }, 10000);
        }
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.setAttribute('aria-label', 'Chase AI is typing');
        typingDiv.innerHTML = `
            <span>[CHASE AI]</span>
            <span>Processing query</span>
            <div class="typing-dots" aria-hidden="true">
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
        this.chatWindow.scrollTo({
            top: this.chatWindow.scrollHeight,
            behavior: 'smooth'
        });
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
            this.addMessage(`Error: ${error.message || 'Unable to connect to Chase AI n8n backend. Please check your connection and try again.'}`, false, true, 'error');
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
    const resizeMatrix = initMatrix();
    window.chatbot = new ChaseAIChatbot();
    
    // Handle window resize for matrix background
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeMatrix, 100); // Debounce resize
    });
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