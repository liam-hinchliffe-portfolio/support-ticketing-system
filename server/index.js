const express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config()

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.routes');
const ticketRouter = require('./routes/ticket.routes');
const commentRouter = require('./routes/comment.routes');

const PORT = 8080;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    msg: 'You are sending too many requests',
    headers: true,
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined'));
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser())

app.use('/users', userRouter);
app.use('/comments', commentRouter);
app.use('/tickets', ticketRouter);

mongoose.connect('mongodb://localhost:27017/ticketingsystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(response => {
    app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
    return response;
}).catch(err => console.log("Error connecting to database"));