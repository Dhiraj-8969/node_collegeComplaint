const mongoose = require("mongoose");
require('dotenv').config();
const mongoURL = process.env.DB_URL_LOCAL;
//const mongoURL=process.env.DB_URL;
mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('connected to mongodb server');
});

db.on('error', (err) => {
    console.log('mongoDB connection error', err);
});

db.on('disconnected', () => {
    console.log('mongodb server disconnected');
});

module.exports = db;