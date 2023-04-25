const express = require('express');
const path = require('path');
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

var cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();

connectDb();
const app = express();
app.use(cors());
app.use(cookieParser());
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

app.use(errorHandler);

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });


const server = http.createServer(app)

server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})