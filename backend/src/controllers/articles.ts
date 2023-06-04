import { Articles } from "../models/articles";
import { NextFunction, Response, Request } from "express";
import { IArticle } from "../types/IArticle";
import { IErrorObject } from "../types/IError";
import { v4 as generateId } from "uuid";

interface DBResponse {
  code: string;
  failed: boolean;
  message: string;
  rows: {
    affectedRows: number;
  };
}

export const saveArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    content,
    image_url,
    category_id,
    series_id,
    author_id,
  }: IArticle = req.body;

  try {
    console.log(req.body);
    const id = generateId();

    const article = new Articles(
      id,
      image_url,
      content,
      category_id,
      series_id,
      author_id,
      title
    );

    const newArticle = (await article.save()) as DBResponse;
    if (newArticle.failed || newArticle.rows.affectedRows === 0) {
      console.log(newArticle);
      const error = { code: 200, message: "failed" } as IErrorObject;
      throw error;
    }
    res
      .status(200)
      .json({ message: "saved article successfully ", newArticle });
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { image_url, content, title, category_id } = req.body;
  const { id } = req.params;
  if (Object.values(req.body).includes(undefined)) {
    const error = new Error("some of  article details  missing");
    throw id;
  }

  try {
    const article = { id, image_url, content, title, category_id };

    const updateResponse = (await Articles.update(article)) as DBResponse;
    if (updateResponse.failed || updateResponse.rows.affectedRows === 0) {
      console.log(updateResponse);
      const error = new Error("an error occured, could not update");
      throw error;
    }
    console.log(updateResponse);
    res.status(200).json({ message: "Articles  updated", updateResponse });
  } catch (error) {
    next(error);
  }
};

export const findAllArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = (await Articles.findAll()) as DBResponse;
    if (response.failed) {
      const error = new Error();
      throw error;
    }

    res
      .status(200)
      .json({ message: "found all articles", response: response.rows });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = (await Articles.deleteArticle(id)) as DBResponse;

    if (response.failed || response.rows.affectedRows === 0) {
      const error = new Error("failed to delete");
      throw error;
    }

    res.status(200).json({ message: "Articles deleted successdully" });
  } catch (error) {
    next(error);
  }
};

export const findArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const response = (await Articles.findByID(id)) as DBResponse;
    if (response.failed) {
      const error = new Error("could not get article");
      throw error;
    }

    res.status(200).json({ message: "found article", data: response.rows });
  } catch (error) {
    next(error);
  }
};
