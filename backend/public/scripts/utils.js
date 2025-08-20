
// Reusable chat utilities for fetching and rendering
// Keep these generic so they can be reused across pages.

(function (global) {
    const $ = (sel, root = document) => root.querySelector(sel);

    // Element creators
    const el = {
        message({ role, content }) {
            const li = document.createElement('li');
            li.className = `message ${role === 'user' ? 'message--user' : ''}`;
            li.innerHTML = `
        ${role === 'user' ? '' : '<div class="avatar">G</div>'}
        <div class="bubble"><p></p></div>
        ${role === 'user' ? '<div class="avatar avatar--user">U</div>' : ''}
      `;
            li.querySelector('p').textContent = content;
            return li;
        },
        typing() {
            const li = document.createElement('li');
            li.className = 'message';
            li.innerHTML = `
        <div class="avatar">G</div>
        <div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>
      `;
            return li;
        },
    };

    const dom = {
        list: () => $('#messages'),
        title: () => $('.chat-title'),
        chatList: () => $('#chat-list'),
        messagesContainer: () => $('.messages'),
    };

    const scrollToBottom = () => {
        const container = dom.messagesContainer();
        if (container) container.scrollTop = container.scrollHeight;
    };

    // API layer — replace placeholders with your real endpoints
    const api = {
        // Fetch messages for a chat
        async fetchMessages(chatId) {
            // TODO: replace URL with your server route, e.g. `/api/chats/${chatId}/messages`
            // Example expected response: { messages: [{ role: 'user'|'assistant', content: '...' }, ...] }
            if (!global.axios) throw new Error('Axios not found');
            const url = `/api/chats/${encodeURIComponent(chatId)}/messages`; // placeholder
            const res = await axios.get(url);
            return res.data?.messages ?? [];
        },
    };

    // Rendering helpers
    const render = {
        clearMessages() {
            const list = dom.list();
            if (list) list.innerHTML = '';
        },
        messages(messages) {
            const list = dom.list();
            if (!list) return;
            const frag = document.createDocumentFragment();
            messages.forEach((m) => frag.appendChild(el.message(m)));
            list.innerHTML = '';
            list.appendChild(frag);
            scrollToBottom();
        },
        title(name) {
            const t = dom.title();
            if (t) t.textContent = name ?? '';
        },
    };

    // Chat switching controller
    async function openChatById({ chatId, chatName }) {
        if (!chatId) return;
        render.title(chatName || '');
        render.clearMessages();

        // Optional: show typing while loading
        const list = dom.list();
        const typing = el.typing();
        if (list) list.appendChild(typing);

        try {
            const msgs = await api.fetchMessages(chatId);
            typing.remove();
            render.messages(msgs);
        } catch (err) {
            console.error('Failed to load messages', err);
            typing.remove();
            const errorNode = el.message({ role: 'assistant', content: 'Unable to load messages.' });
            if (list) list.appendChild(errorNode);
        }
    }

    // Expose utilities
    global.ChatUtils = { el, dom, render, api, scrollToBottom, openChatById };
})(window);