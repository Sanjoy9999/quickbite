import express from "express"
import { addItem,deleteItem,editItem, getItemByCity, getItemById, getItemsByShop, rating, searchItems } from "../controllers/item.controller.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"

const itemRouter = express.Router()

itemRouter.post("/add-food-item",isAuth,upload.single("image"), addItem)
itemRouter.post("/edit-food-item/:itemId",isAuth,upload.single("image"), editItem)
itemRouter.get("/get-by-id/:itemId",isAuth, getItemById)
itemRouter.get("/delete-item/:itemId",isAuth, deleteItem)
itemRouter.get("/get-by-city/:city",isAuth, getItemByCity)
itemRouter.get("/get-items-by-shop/:shopId",isAuth, getItemsByShop)
itemRouter.get("/search-items",isAuth, searchItems)
itemRouter.post("/rating",isAuth, rating)

export default itemRouter
