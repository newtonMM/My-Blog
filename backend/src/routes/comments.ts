import { Router } from "express";
import {
  saveComment,
  findAllArticleComments,
  findComment,
  deleteComment,
  updateComment,
} from "../controllers/comments";

const router = Router();

router.post("/new-comment", saveComment);
router.put("/update-comment/:id", updateComment);
router.get("/all-comments/:article_id", findAllArticleComments);
router.delete("/delete-comment/:id", deleteComment);
router.get("/get-comment/:id", findComment);

export default router;
