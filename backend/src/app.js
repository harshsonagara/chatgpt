const express = require('express');
const app = express();

// View Engine
app.set("view engine", "ejs");
app.use(express.static('public')); // serve static files from the public directory

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parse incoming requests with urlencoded payloads

// Routes
const indexRoutes = require('./routes/index.routes');
const authRoutes = require('./routes/auth.routes');
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

module.exports = app;
