require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan")
const app = express();
const router = require("./routes");
const path = require('path')

require('./db/db')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(router);
app.use(express.json());
app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "client")));
app.use(morgan("dev"));

// const uri = 'mongodb://127.0.0.1:27017';

const { HTTP_PORT } = process.env;

app.use((req, res, next) => {
    return res.status(404).json({
        status: false,
        message: 'hayo tersesat ya?'
    })
})

app.use((err, req, res, next) => {
    if(err.code == 'LIMIT_FILE_SIZE' || err.message == 'file too large'){
        return res.status(500).json({
            status: false,
            message: "ukuran file terlalu besar maksimal 1 MB untuk images dan untuk video maksimal 10 MB"
        })
    } else {
    return res.status(500).json({
        status: false,
        message: err.message
    })
}
})



app.listen(HTTP_PORT, () => console.log("listening on port", HTTP_PORT));