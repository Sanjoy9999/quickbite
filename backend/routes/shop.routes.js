import express from "express"
import { createAndEditShop, getMyShop, getShopByCity } from "../controllers/shop.controller.js"
import isAuth from "../middleware/isAuth.js"
import upload  from "../middleware/multer.js"

const shopRouter = express.Router()

shopRouter.post("/create-edit", isAuth,upload.single("image"), createAndEditShop)
shopRouter.get("/my-shop",isAuth,getMyShop)
shopRouter.get("/get-by-city/:city",isAuth,getShopByCity)

export default shopRouter
