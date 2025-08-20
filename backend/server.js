const app = require('./src/app');
const connectDB = require('./src/db/db');
const setupSocketServer = require('./src/socket/socket.server');
const http = require('http');


const httpServer = http.createServer(app);

setupSocketServer(httpServer);

connectDB();

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});