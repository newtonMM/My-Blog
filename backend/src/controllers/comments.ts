import { Comments } from "../models/comments";
import { NextFunction, Response, Request } from "express";
import { DBResponse } from "../types/IDBResponse";
import { ICommentUpdate } from "../types/IComment";
import { IErrorObject } from "../types/IError";

export const saveComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { comment, article_id, user_prof_id } = req.body;

  try {
    const newComment = new Comments(comment, article_id, user_prof_id);

    const response = (await newComment.save()) as DBResponse;
    if (response.failed) {
      console.log(response);
      const error = { code: 200, message: "failed" } as IErrorObject;
      throw error;
    }

    res.status(200).json({ message: "saved successfully", response });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const comment = req.body;

  const id = parseInt(req.params.id);

  if (!req.body || !id) {
    const error = new Error(" comment details or the category id are missing");
    throw id;
  }
  const data: ICommentUpdate = { comment, id };

  try {
    const response = (await Comments.update(data)) as DBResponse;
    console.log(response);
    if (response.failed) {
      const error = new Error("could not update the comment ");
      throw error;
    }

    res.status(200).json({ message: "updated successfully " });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params);
  const id = parseInt(req.params.id);
  console;

  try {
    const response = (await Comments.delete(id)) as DBResponse;
    console.log(response);
    if (response.failed || response.rows.affectedRows === 0) {
      const error = new Error("could not delete the comment ");
      throw error;
    }
    res.status(200).json({ message: "delete successful" });
  } catch (error) {
    next(error);
  }
};

export const findAllArticleComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { article_id } = req.params;
  console.log(req.session);
  try {
    const response = (await Comments.findAll(article_id)) as DBResponse;

    if (response.failed || response.rows.length === 0) {
      const error = new Error("could not find the comment ");
      throw error;
    }
    console.log(response);
    res
      .status(200)
      .json({ message: " found the comment ", data: response.rows });
  } catch (error) {
    next(error);
  }
};
export const findComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);

  try {
    const response = (await Comments.findOne(id)) as DBResponse;

    if (response.failed) {
      const error = new Error("could not find the comment ");
      throw error;
    }
    res.status(200).json({ message: "success", data: response.rows });
  } catch (error) {
    next(error);
  }
};
