fetch('./elements/footer.html')
    .then(responsefooter => responsefooter.text())
    .then(footerData => {
        document.querySelector('footer').innerHTML = footerData;
    })
    .finally(() => {
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
        const diana = document.querySelector('.project-diana');
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
                    dialog.style.animation = `${closeBtn.dataset.dialogAnim} .3s cubic-bezier(0.475, 0.82, 0.165, 1)`;
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
        
        function typeWriter(element, text, speed = 23) {
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
        
        const input = document.getElementById('user-input');
        const ctr = document.querySelector('.suggested-text');
        const categories = ctr.querySelectorAll('.category');
        const userMessage = input.value.trim();

        categories.forEach(el => {
            el.addEventListener('click', (e) => {
                input.value = e.target.textContent.trim();
                input.focus();
            });
        });

        async function sendMessage() {
            const input = document.getElementById('user-input');
            const sendBtn = document.getElementById('send-chat');
            const chatContent = document.querySelector('.chat-content');
            const contentDiv = document.getElementById('content');
            const userMessage = input.value.trim();
            if (!userMessage) return;
            
            chatContent.querySelector('.greeting')?.remove();

            // Render user bubble message
            chatContent.innerHTML += `
                <div class="bubble-message user">
                    <div class="message">
                        <p>${escapeHtml(userMessage)}</p>
                    </div>
                </div>
            `;
            

            input.value = '';
            sendBtn.disabled = true;

            // Thinking indicator
            const thinkingId = 'thinking-' + Date.now();
            const thinkingNow = 'Lyra is thinking. We are finding memories right now...';
            chatContent.innerHTML += `
                <div class="bubble-message ai thinking" id="${thinkingId}">
                    <div class="message lyra" style="font-style: italic; opacity: 0.6;">
                        <p>${thinkingNow}</p>
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
                
                conversationHistory.push({ role: 'assistant', content: aiText });

                document.getElementById(thinkingId)?.remove();
                
                const bubble = document.createElement('div');
                bubble.className = 'bubble-message ai';
                bubble.innerHTML = `
                    <div class="message lyra">
                        <p>${aiText.replace('/\n/g', '<br>')}</p>
                    </div>
                `;
                chatContent.appendChild(bubble);
                
                const p = bubble.querySelector('p');
                await typeWriter(p, aiText);
                p.classList.add('done');
            } catch (err) {
                document.getElementById(thinkingId)?.remove();
                
                const bubble = document.createElement('div');
                bubble.className = 'bubble-message ai';
                bubble.innerHTML = `
                    <div class="message lyra">
                        <p></p>
                    </div>
                `;
                chatContent.appendChild(bubble);
                
                const p = bubble.querySelector('p');
                await typeWriter(p, "Oops! Something went wrong. Please try again later.");
                p.classList.add('done');
            }

            sendBtn.disabled = false;
            contentDiv.scrollTop = contentDiv.scrollHeight;
            input.focus();
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
    .catch(error => console.error("Failed to fetch:", error));