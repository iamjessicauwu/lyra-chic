function loadDiana() {
    const script = document.createElement("script");
    script.defer = true;
    script.src = '/project-diana/diana.js';
    document.head.appendChild(script);
}

fetch('/elements/footer.html')
    .then(responsefooter => responsefooter.text())
    .then(footerData => {
        document.querySelector('footer').innerHTML = footerData;
    })
    .finally(() => {
        loadDiana();
        function safe(parent, selector ) {
            if (!parent) return null;
            return parent.querySelector(selector);
        }

        // Gets the current year for id "year"
        let year = document.getElementById("year");
        if (year) {
            var getYear = new Date();
            year.innerHTML = getYear.getFullYear();
        }
        document.getElementById('back-to-top').addEventListener('click', (e) => {
            document.documentElement.scrollTo({top: 0, behavior: 'smooth'});
        });

        const fab = document.getElementById('talk');
        let startTime;

        function openDialog(className) {
            document.querySelector(`.${className}`)?.showModal();
        }

        document.addEventListener('click', (e) => {
            // Prevents the Project Diana from opening when clicking inside the content area
            clearTimeout(startTime);

            const dialogOpen = e.target.closest('[data-dialog-open]');
            if (dialogOpen) {
                openDialog(dialogOpen.dataset.dialogOpen);
            }

            const closeBtn = e.target.closest('[data-dialog-close]');
            const dialog = closeBtn?.closest('dialog');
            if (closeBtn) {
                requestAnimationFrame(() => {
                    dialog.style.animation = `${closeBtn.dataset.dialogAnim} 350ms cubic-bezier(0.5, 0, 0.75, 0)`;
                    dialog.addEventListener('animationend', () => {
                        closeBtn.closest('dialog')?.close();
                        dialog.style.animation = '';
                    }, {once: true});
                })
            }
        });
        
        fab.addEventListener('pointerdown', (e) => {
            startTime = setTimeout(() => {
                console.log('Project Diana is successfully activated!')
                openDialog('project-diana');
            }, 3000);
        });

        fab.addEventListener('pointerup', () => {
            diana.scrollTop = 0;
            clearTimeout(startTime);
        })

        const conversationHistory = [];
        
        function typeWriter(element, text, speed = 12) {
            element.textContent = '';
            let i = 0;
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    element.textContent += text[i];
                    i++;
                    if (i >= text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, speed);
            });
        }
        
        const chatPanel = document.querySelector('.talk-to-lyra');
        const input = document.getElementById('user-input');
        const ctr = document.querySelector('.suggested-text');
        const categories = ctr.querySelectorAll('.category');
        const chatContent = document.querySelector('.chat-content');
        const userMessage = input.value.trim();

        categories.forEach(el => {
            el.addEventListener('click', (e) => {
                input.value = e.target.textContent.trim();
                input.focus();
            });
        });

        function performCopy(bubble) {
            document.querySelectorAll('.copy-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const container = e.target.closest('.bubble-message');
                    const copy = container.querySelector('.copy-btn');
                    const icon = copy.querySelector('i');
                    
                    icon.className = 'ri-check-line';
                    try {
                        await navigator.clipboard.writeText(bubble.querySelector('p').textContent);
                        setTimeout(() => {
                            icon.className = 'ri-file-copy-line';
                        }, 3000)
                    } catch (err) {
                        console.error('Cannot copy the message', err);
                    }
                })
            });
        }

        function textToSpeech(bubble) {
            document.querySelectorAll('.speak-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const container = e.target.closest('.bubble-message');
                    const speak = container.querySelector('.speak-btn');
                    const icon = speak.querySelector('i');
                    icon.className = 'ri-speak-ai-fill';
    
                    function speakGirl(text) {
                        if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(text);
                            const voices = window.speechSynthesis.getVoices();
        
                            const femaleVoice = voices.find(voice =>  voice.name.includes('Google US English Female') || voice.name.includes('Zira'));
                            
                            if (femaleVoice) {
                                utterance.voice = femaleVoice;
                            }
                            
                            utterance.rate = 1.3;
                            utterance.pitch = 1.3;
        
                            utterance.addEventListener('end', () => {
                                icon.className = 'ri-speak-ai-line';
                            })
                            
                            window.speechSynthesis.cancel();
                            window.speechSynthesis.speak(utterance);
                        }
                    }
    
                    const text = bubble.querySelector('p').textContent;
    
                    if (speechSynthesis.getVoices().length > 0) {
                        speakGirl(text);
                    } else {
                        speechSynthesis.onvoiceschanged = () => {
                            speakGirl();
                        }
                    }
                })
            })
        }

        const greeting = chatContent.querySelector('.greeting');
        let greetingTitleEl = document.getElementById('greeting-title');
        const greetingTitles = ["Ready, set, chat!", "What kind of magic are we making today?", "Me help you? Yes, me can! What you want today?", "Woohoo, you're here! 🎉", "Once upon a time... what happens next?", "Welcome back! What’s the scoop today? ☕"];
        document.getElementById('delete-chat').addEventListener('click', () => {
            chatContent.innerHTML = "";
            conversationHistory.length = 0;
            if (conversationHistory.length === 0) {
                chatContent.prepend(greeting);
            }
        });

        
        const random = Math.floor(Math.random() * greetingTitles.length);
        greetingTitleEl.textContent = greetingTitles[random];

        async function sendMessage() {
            const input = document.getElementById('user-input');
            const sendBtn = document.getElementById('send-chat');
            const contentDiv = document.querySelector('.chat-content');
            
            const userMessage = input.value.trim();
            if (!userMessage) return;
            
            document.querySelector('.greeting')?.remove();

            const existingBubbles = chatContent.querySelectorAll('.bubble-message');
            existingBubbles.forEach(bubble => bubble.classList.remove('animate'));

            // Render user bubble message
            const userBubble = document.createElement('div');
            userBubble.className = 'bubble-message user';
            userBubble.innerHTML = `
                <div class="message user-input">
                    <p></p>
                </div>
            `;
            
            const userInput = userBubble.querySelector('p');
            userInput.textContent = `${escapeHtml(userMessage)}`;
            chatContent.appendChild(userBubble);
            
            contentDiv.scrollTop = contentDiv.scrollHeight;

            input.value = '';
            sendBtn.disabled = true;

            // Thinking indicator
            const thinkingId = 'thinking-' + Date.now();
            chatContent.innerHTML += `
                <div class="bubble-message ai thinking" id="${thinkingId}">
                    <div class="message lyra" style="font-style: italic; opacity: 0.6;">
                        <div class="lyra-dot"></div>
                    </div>
                </div>
            `;

            contentDiv.scrollTop = contentDiv.scrollHeight;

            conversationHistory.push({ role: 'user', content: userMessage });

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        conversationHistory
                    })
                });

                const data = await response.json();
                const aiText = data.content?.map(b => b.text || '').join('') || "Sorry, I couldn't generate a response right now. Try again later.";
                
                document.getElementById(thinkingId)?.remove();
                
                conversationHistory.push({ role: 'assistant', content: aiText });

                const bubble = document.createElement('div');
                bubble.className = 'bubble-message ai';
                bubble.innerHTML = `
                    <div class="message lyra">
                        <p></p>
                        <div class="actions-buttons">
                            <button class="btn btn-transparent action-btn copy-btn" title="Copy"><i class="ri-file-copy-line"></i></button>
                            <button class="btn btn-transparent action-btn speak-btn" title="Speak"><i class="ri-speak-ai-line"></i></button>
                        </div>
                    </div>
                `;
                bubble.classList.add('animate');
                chatContent.appendChild(bubble);

                const actions = bubble.querySelector('.actions-buttons');
                actions.hidden = true;
                
                const p = bubble.querySelector('p');
                await typeWriter(p, aiText);
                p.classList.add('done');

                performCopy(bubble);
                textToSpeech(bubble);
                actions.hidden = false;
                sendBtn.disabled = false;

            } catch (err) {
                document.getElementById(thinkingId)?.remove();
                
                const bubble = document.createElement('div');
                bubble.className = 'bubble-message ai';
                bubble.innerHTML = `
                    <div class="message lyra">
                        <p></p>
                        <div class="actions-buttons">
                            <button class="btn btn-transparent action-btn copy-btn" title="Copy"><i class="ri-file-copy-line"></i></button>
                            <button class="btn btn-transparent action-btn speak-btn" title="Speak"><i class="ri-speak-ai-line"></i></button>
                        </div>
                    </div>
                `;
                chatContent.appendChild(bubble);
                
                const actions = bubble.querySelector('.actions-buttons');
                actions.hidden = true;

                const p = bubble.querySelector('p');
                await typeWriter(p, "Oops! Something went wrong. Please try again later.");
                p.classList.add('done');

                performCopy(bubble);
                textToSpeech(bubble);
                actions.hidden = false;
                sendBtn.disabled = false;
            }

        }

        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        document.getElementById('send-chat').addEventListener('click', sendMessage);
        document.getElementById('user-input').addEventListener('keydown', e => {
            if (e.key === 'Enter') sendMessage();
        })
    })
    .catch(error => console.log("Failed to fetch:", error));