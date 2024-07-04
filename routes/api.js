
import { Router } from "express";
import AuthController from "../Controller/AuthController.js";
import authMiddleware from "../middleware/auth_middleware.js";
import ProfileController from "../Controller/ProfileController.js";
import NewsController from "../Controller/NewsController.js";


const router = Router()

router.post("/auth/register/",AuthController.register)
router.post("/auth/login/", AuthController.login)

router.get("/send-email/",AuthController.sendEmail)

// profile


router.get("/profile",authMiddleware,ProfileController.getUser)
router.put("/profile/:id", authMiddleware, ProfileController.updateUser)


// news

router.get("/news", NewsController.index);
router.post("/news", authMiddleware , NewsController.store);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", authMiddleware, NewsController.update);
router.delete("/news/:id",authMiddleware, NewsController.destroy);











export default router;