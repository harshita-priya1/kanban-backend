import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import joi from "joi";

import userModel from "../models/user.model";
import refreshTokenModel from "../models/refreshToken.model";

require("dotenv").config();

const userRouter: Router = express.Router();

const userSchema = joi.object({
  name: joi
    .string()
    .trim()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
  password: joi
    .string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/)
    .min(8)
    .required(),
  email: joi
    .string()
    .email()
    .pattern(new RegExp("^[w-.]+@([w-]+.)+[w-]{2,4}$"))
    .required(),
  phoneNo: joi
    .number()
    .integer()
    .min(1000000000) // Minimum 10-digit number
    .max(9999999999)
    .required(),
});
