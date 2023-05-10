import { Router } from "express";
import {
  saveArticle,
  updateArticle,
  deleteArticle,
  findAllArticles,
  findArticle,
} from "../controllers/articles";

const router = Router();

router.post("/create-article", saveArticle);
router.put("/update-article/:id", updateArticle);
router.get("/all-articles", findAllArticles);
router.delete("/delete-article/:id", deleteArticle);
router.get("/get-article/:id", findArticle);

export default router;
