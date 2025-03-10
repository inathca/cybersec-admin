const express = require('express');
const {PrismaClient} = require("@prisma/client");
const bodyParser = require("body-parser")
const crypto = require("crypto-js");
const env = require("dotenv");

env.config();

const my_password = "demo";
//const my_key = "nongiceeiei";
const my_key = process.env.SECRET_KEY;

//encode
const password = crypto.AES.encrypt(my_password,my_key);
console.log('password',password.toString());

//decode
const data = crypto.AES.decrypt(password,my_key);
console.log('data',data.toString(crypto.enc.Utf8));