import express, { Router } from "express";

import { signUp, signIn, updateUser } from "../controllers/user.controller";

const userRouter: Router = express.Router();

userRouter.post("/signup", signUp);

userRouter.post("/signin", signIn);

userRouter.post("/updateuser", updateUser);

export default userRouter;
