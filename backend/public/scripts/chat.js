// Chat logic — handles sending messages and simple rendering
// Mobile-first, no framework. Progressive enhancement friendly.

(function () {
    const form = document.querySelector('#composer-form');
    const textarea = document.querySelector('#composer-input');
    const list = document.querySelector('#messages');

    // Sidebar elements
    const sidebar = document.querySelector('#sidebar');
    const sidebarOpen = document.querySelector('#sidebar-open');
    const sidebarClose = document.querySelector('#sidebar-close');
    const sidebarBackdrop = document.querySelector('#sidebar-backdrop');

    if (sidebar && sidebarOpen && sidebarClose && sidebarBackdrop) {
        const setSidebar = (open) => {
            sidebar.dataset.open = String(open);
            sidebarBackdrop.dataset.open = String(open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        sidebarOpen.addEventListener('click', () => setSidebar(true));
        sidebarClose.addEventListener('click', () => setSidebar(false));
        sidebarBackdrop.addEventListener('click', () => setSidebar(false));
    }

    if (!form || !textarea || !list) return;

    // Enter to send (Shift+Enter for newline)
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.requestSubmit();
        }
    });

    // Auto-resize textarea
    const autoresize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    };
    textarea.addEventListener('input', autoresize);
    window.addEventListener('load', autoresize);

    // Use shared utilities
    const { el, render, scrollToBottom, openChatById } = window.ChatUtils || {};
    const createMessage = el?.message || (({ role, content }) => {
        const li = document.createElement('li');
        li.className = `message ${role === 'user' ? 'message--user' : ''}`;
        li.innerHTML = `
                    ${role === 'user' ? '' : '<div class="avatar">G</div>'}
                    <div class="bubble"><p></p></div>
                    ${role === 'user' ? '<div class="avatar avatar--user">U</div>' : ''}
                `;
        li.querySelector('p').textContent = content;
        return li;
    });


    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = textarea.value.trim();
        if (!text) return;

        // Render user message
        const userMsg = createMessage({ role: 'user', content: text });
        list.appendChild(userMsg);
        textarea.value = '';
        autoresize();
        scrollToBottom();


        scrollToBottom();

        try {
            socket.emit('ai-message', text)
        } catch (err) {
            console.error(err);
            const errorMsg = createMessage({ role: 'assistant', content: 'Something went wrong. Please try again.' });
            list.appendChild(errorMsg);
            scrollToBottom();
        }
    });

    socket.on("ai-message-response", (message) => {
        const messageItem = createMessage({
            role: "assistant",
            content: message
        })
        list.appendChild(messageItem);
    })

    // Chat list item factory: attach a dataset chat id for fetching
    function createChatListItem({ id, name, active = false }) {
        const safeId = String(id ?? name).toLowerCase().replace(/\s+/g, '-');
        return `<button class="chat-list__item ${active ? 'is-active' : ''}" data-chat-id="${safeId}" title="${name}">${name}</button>`
    }

    function setActiveChatButton(btn) {
        const chatList = document.querySelector('#chat-list');
        if (!chatList) return;
        chatList.querySelectorAll('.chat-list__item').forEach((el) => el.classList.remove('is-active'));
        if (btn) btn.classList.add('is-active');
    }

    function addChatToList(name) {
        const chatList = document.querySelector("#chat-list");
        if (!chatList) return;
        chatList.insertAdjacentHTML("beforeend", createChatListItem({ name, active: true }));
        setActiveChatButton(chatList.lastElementChild);
    }

    function changeChatTitle(name) {
        const chatTitle = document.querySelector(".chat-title");
        if (chatTitle) {
            chatTitle.textContent = name;
        }
    }

    function clearChatMessage() {
        const messages = document.querySelector("#messages");
        if (messages) {
            messages.innerHTML = "";
        }
    }

    // Event delegation for opening a chat from the list
    const chatListEl = document.querySelector('#chat-list');
    if (chatListEl) {
        chatListEl.addEventListener('click', async (e) => {
            const target = e.target.closest('.chat-list__item');
            if (!target) return;
            const chatId = target.dataset.chatId;
            const chatName = target.textContent.trim();
            setActiveChatButton(target);
            // Fetch and render messages for this chat using utilities (Axios under the hood)
            if (typeof openChatById === 'function') {
                openChatById({ chatId, chatName });
            } else {
                changeChatTitle(chatName);
                clearChatMessage();
            }
        });
    }

    document.querySelector("#new-chat").addEventListener("click", (e) => {

        const chatname = prompt("Enter chat name:");

        if (!chatname) {
            return
        }

        addChatToList(chatname);
        changeChatTitle(chatname);
        clearChatMessage();

    })



})();
