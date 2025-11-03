import express from "express";
import { signup, signin } from "../controllers/authController.js";
import { getPosts, createPost, editPost, deletePost } from "../controllers/blogController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/posts", getPosts);
router.post("/posts", verifyToken, createPost);
router.put("/posts/:id", verifyToken, editPost);
router.delete("/posts/:id", verifyToken, deletePost);

export default router;
