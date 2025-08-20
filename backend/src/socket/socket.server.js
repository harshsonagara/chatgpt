const { Server } = require('socket.io');
const aiService = require('../services/ai.service');

function setupSocketServer(httpServer){

    const io = new Server(httpServer,{});

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('ai-message', async(message)=>{
            console.log('AI message received:', message);

            const result = await aiService.generateContent(message);            
            socket.emit('ai-message-response', result);
        })

    });

    return io;
}

module.exports =  setupSocketServer ;