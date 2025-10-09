import express from "express"
import { getCurrentUser, updateLocation } from "../controllers/user.controller.js"
import isAuth from "../middleware/isAuth.js"

const userRouter = express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update-location",isAuth,updateLocation)

export default userRouter
