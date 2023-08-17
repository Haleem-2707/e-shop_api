require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");


// routes
//Product Route
const categoryRouter = require("./routes/categoryRouter");
const orderRouter = require("./routes/orderRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const globalErrHandler = require("./middlewares/globalErrHandler");
app.use(cors());
app.options("*", cors());

// middeleware
app.use(express.json());
app.use(morgan("tiny"));

// console.log API
const api = process.env.API_URL;
// console.log(api);


// connecting with database
// to hide my database URL
const db = process.env.CONNECTION_STRING
mongoose
.connect (db, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName:"eshop"
    }
)
.then(() => {
    console.log("DATABASE CONNECT");
})
.catch((err) => {
    console.log(err);
});

// routes
//Product Route
app.use(`${api}/products`, productRouter);

// Order Route
app.use(`${api}/orders`, orderRouter);

// User Router
app.use(`${api}/users`, userRouter);

// Category Router
app.use(`${api}/categories`, categoryRouter);

//Error handlers middleware
app.use(globalErrHandler);

//404 Error
app.use('*', (req, res) => {
    res.status(404).json({
        message: `${req.originalUrl} -Route not found`,
    });
});


//HTTP://localhost:2022/api/v1/products

app.listen(2024, () => {
    console.log("The server is running on HTTP://localhost:2022");
})




 