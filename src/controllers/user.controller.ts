import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import joi from "joi";

import userModel from "../models/user.model";
import refreshTokenModel from "../models/refreshToken.model";

require("dotenv").config();

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
  phoneNo: joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
});

export async function signUp(req: Request, res: Response) {
  let { name, password, email, phoneNo } = req.body;
  name = name.trim();
  password = password.trim();
  email = email.trim();
  phoneNo = phoneNo.trim();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let user = new userModel({
    name: name,
    password: hashedPassword,
    email: email,
    phoneNo: phoneNo,
  });

  const { error } = await userSchema.validateAsync(user);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const emailExist = await userModel.findOne({ email: email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while checking for existing user!",
    });
  }

  let savedUser;
  try {
    savedUser = await user.save();
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while creating user!",
    });
  }

  let token;
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
      return res.status(500).json({
        status: "FAILED",
        message: "JWT_SECRET_KEY is not defined in the environment variables",
      });
    }
    token = jwt.sign({ id: savedUser._id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const refreshToken = uuidv4();

    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const newRefreshToken = new refreshTokenModel({
      userId: savedUser._id,
      token: refreshToken,
      expiresAt: expirationDate,
    });
    await newRefreshToken.save();
    res.status(201).json({
      status: "SUCCESS",
      message: "Signup successful",
      data: {
        token,
        refreshToken,
        user: savedUser,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred while saving refresh token.",
    });
  }
}

export async function signIn(req: Request, res: Response) {
  let email = req.body.email;
  let password = req.body.password;
  email = email.trim();
  password = password.trim();
  if (email == "" || password == "") {
    res.status(400).json({
      status: "FAILED",
      message: "Empty input fields",
    });
  } else {
    userModel
      .findOne({ email })
      .then((user) => {
        if (!user) {
          res.status(400).json({
            status: "FAILED",
            message: "Invalid email or password",
          });
        } else {
          const hashedPassword = user.password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                // Generate token and refresh token
                const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
                if (!JWT_SECRET_KEY) {
                  return res.status(500).json({
                    status: "FAILED",
                    message:
                      "JWT_SECRET_KEY is not defined in the environment variables",
                  });
                }

                const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
                  expiresIn: "12h",
                });
                const refreshToken = uuidv4();

                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30); // 30 days in milliseconds

                // Find and update existing refreshToken record
                refreshTokenModel
                  .findOneAndUpdate(
                    { userId: user._id },
                    { token: refreshToken, expiresAt: expirationDate },
                    { new: true, upsert: true }
                  )
                  .then((updatedToken) => {
                    res.status(200).json({
                      status: "SUCCESS",
                      message: "signin successful",
                      data: {
                        token,
                        refreshToken,
                        user,
                      },
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      status: "FAILED",
                      message:
                        "An error occurred while updating refresh token.",
                    });
                  });
              } else {
                res.status(400).json({
                  status: "FAILED",
                  message: "Invalid email or password",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                status: "FAILED",
                message: "An error occurred while comparing passwords.",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "FAILED",
          message: "An error occurred while checking for existing user!",
        });
      });
  }
}

export async function updateUser(req: Request, res: Response) {
  let { name, phoneNo } = req.body;
  name = name.trim();
  phoneNo = phoneNo.trim();
  const userId = req.body.userId;

  if (name == "" || phoneNo == "") {
    return res.status(400).json({
      status: "FAILED",
      message: "Empty input fields",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  } else if (!/^\d{10}$/.test(phoneNo)) {
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid phone number entered",
    });
  } else {
    userModel
      .find({ phoneNo: phoneNo })
      .then((user) => {
        if (user.length) {
          return res.status(500).json({
            status: "FAILED",
            message:
              "Phone number already in use! please try with another number.",
          });
        } else {
          userModel
            .findByIdAndUpdate(
              userId,
              { name: name, phoneNo: phoneNo },
              { new: true }
            )
            .then((updatedUser) => {
              return res.status(200).json({
                status: "SUCCESS",
                message: "User data updated successfully!",
                data: updatedUser,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                status: "FAILED",
                message: "An error occurred while updating user data!",
                error: err,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          status: "FAILED",
          message: "An error occurred while checking for phone number!",
          error: err,
        });
      });
  }
}

module.exports = {
  signUp,
  signIn,
  updateUser,
};
