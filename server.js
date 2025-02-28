const express = require('express')
const app = express();
const db = require('./db.js');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { jwtAuthMiddleware } = require('./jwt');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const userRoutes = require('./routes/userRoutes.js');
app.use('/user', userRoutes);
const adminRoutes = require('./routes/adminRoutes.js');
app.use('/admin',jwtAuthMiddleware, adminRoutes);
const complanRoutes = require('./routes/complanRoutes.js');
app.use('/complan',jwtAuthMiddleware, complanRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})