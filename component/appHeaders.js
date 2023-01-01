import { Router } from "express";
import session from "express-session";
var router = Router();
import { createPool } from "mysql";
import http from "http";
import CryptoJS from "crypto-js";
import cookieParser from "cookie-parser";
import axios from "axios";
import mysqlStore  from "express-mysql-session";
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import dotenv from 'dotenv'
dotenv.config();

let jwtSecretKey = process.env.JWT_SECRET_KEY;

const IN_PROD = process.env.NODE_ENV === "production";
const TWO_HOURS = 1000 * 60 * 60 * 4;

const options = {
    connectionLimit: 2000,
    password: process.env.BUZCAMP_DB_PASSWORD,
    user: process.env.BUZCAMP_DB_USER,
    database: process.env.BUZCAMP_DB,
    host: process.env.BUZCAMP_DB_HOST,
    createDatabaseTable: true,
};

//create database connection
const conn = createPool(options);
const sessionStore = new mysqlStore(options, conn);

router.use(
    session({
        name: process.env.SESS_NAME,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        secret: process.env.SESS_SECRET,
        cookie: {
            maxAge: TWO_HOURS,
            sameSite: false,
            secure: IN_PROD,
        },
    })
);


export { session, conn, CryptoJS, router, http, cookieParser, axios, mysqlStore, jwt, jwt_decode, jwtSecretKey };