require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan")
const index = express();
const router = require("./routes");
const path = require('path')

require('./db/db')

index.use(express.json());
index.use(express.urlencoded({ extended: true }));
index.use(cors());
index.use(router);
index.use(express.json());
index.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "client")));
index.use(morgan("dev"));

// const uri = 'mongodb://127.0.0.1:27017';

const { HTTP_PORT } = process.env;

index.get('/', (req, res) => {
    return res.status(200).json({
        status: true,
        message: 'ini percobaan deploy ke vercel'
    })
})

index.use((req, res, next) => {
    return res.status(404).json({
        status: false,
        message: 'hayo tersesat ya?'
    })
})

index.use((err, req, res, next) => {
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



index.listen(HTTP_PORT, () => console.log("listening on port", HTTP_PORT));