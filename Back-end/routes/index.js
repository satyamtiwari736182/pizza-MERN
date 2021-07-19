import express from "express";
import {
  loginController,
  productController,
  refreshController,
  registerController,
  userController,
} from "../controllers";
import admin from "../middlewares/admin";
import auth from "../middlewares/auth";
const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshController.refresh);
router.post("/logout", auth, loginController.logout);

router.post("/products", [auth, admin], productController.store);
router.put("/products/:id", [auth, admin], productController.update);
router.delete("/products/:id", [auth, admin], productController.remove);
router.get("/products/:id", productController.showOne);
router.get("/products", productController.showAll);

// Used post request to send multiple product-ids via body section of the request
router.post("/products/cart-items", productController.getProducts);

export default router;
