import express, { urlencoded, json } from "express";
var app = express();
import sharp from "sharp";
import path from "path";
import { fromString } from "uuidv4";
import cookieParser from 'cookie-parser';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()

app.use(cors());

//To parse URL encoded data
app.use(urlencoded({ extended: false }));

//To parse json data
app.use(json());

// cookie parser middleware
app.use(cookieParser());


const corsOptions = {
  origin: 'https://buzcamp.com',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}


app.use(express.static("public"));
app.use("/images", express.static("public/media/t/v16"));




/**
 * Route to authentication Endpoints
 */
import createuser from "./authentication/signup.js";

import verification from "./authentication/verification.js";

import login from "./authentication/login.js";

import passwordToken from "./authentication/password-token.js";

import reset from "./authentication/reset-password.js";


app.use("/authenticate/", createuser);

app.use("/authenticate/", verification);

app.use("/authenticate/", login);

app.use("/authenticate/", passwordToken);

app.use("/authenticate/", reset);


import geoLocator from "./geolocator/index.js";

app.use("/locator/", geoLocator);

/* import onBoard from "./onboarding/init.js";

app.use("/onboarding", onBoard);
*/

// Other routes here
app.get("*", function (req, res) {
  res.status(404).send("Sorry, this is an invalid URL.");
});

export default app
