const API_KEY = 'AIzaSyDxazHT-4YF_rNmx50dkq8mufNtwkRF6Kg'; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');
let backgroundColor=sessionStorage.getItem('background');
document.body.classList.add(backgroundColor);
sendBtn.addEventListener('click', async () => {
    const userMessage = messageInput.value.trim();
    if (userMessage) {
        messageInput.value = '';
        appendMessage('user', userMessage);
        const botResponse = await sendMessageToGemini(userMessage);
        appendMessage('bot', botResponse);
    }
});

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message ' + (sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; 
}

async function sendMessageToGemini(message) {
    const storedData = sessionStorage.getItem('weatherData');
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text:storedData+ message
                            }
                        ]
                    }
                ]
            })
        });

        if (response.ok) {
            const data = await response.json();
            const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from the bot.';
            return botReply;
        } else {
            console.error('Error:', response.statusText);
            return 'Sorry, there was an error.';
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, there was an error.';
    }
}