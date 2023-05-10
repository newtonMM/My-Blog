import { Category } from "../models/category";
import { NextFunction, Response, Request } from "express";
import { v4 as generateId } from "uuid";

interface DBResponse {
  code: string;
  failed: boolean;
  message: string;
  rows: {
    affectedRows: number;
  };
}

export const saveCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  if (!name) {
    const error = new Error(" entry cannot be empty");
    throw error;
  }
  try {
    console.log(req.body);
    const id = generateId();

    const series = new Category(id, name);

    const newCategory = (await series.save()) as DBResponse;
    if (
      newCategory.failed ||
      !newCategory ||
      newCategory.rows.affectedRows === 0
    ) {
      console.log(newCategory);
      const error = new Error("an error occured, could not save");
      throw error;
    }
    res.status(200).json({ message: "saved category successfully " });
  } catch (error) {
    console.log(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const { id } = req.params;
  if (!req.body || !id) {
    const error = new Error(" category details or the category id are missing");
    throw id;
  }

  try {
    const categories = { name, id };

    const updateResponse = (await Category.update(categories)) as DBResponse;
    if (updateResponse.failed || updateResponse.rows.affectedRows === 0) {
      console.log(updateResponse);
      const error = new Error("an error occured, could not update");
      throw error;
    }
    console.log(updateResponse);
    res.status(200).json({ message: "category  updated" });
  } catch (error) {
    console.log(error);
  }
};

export const findAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = (await Category.findAll()) as DBResponse;
    if (response.failed) {
      const error = new Error("could not fetch categories");
      throw error;
    }

    res
      .status(200)
      .json({ message: "found all users", response: response.rows });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = (await Category.deleteSeries(id)) as DBResponse;

    if (response.failed || response.rows.affectedRows === 0) {
      const error = new Error("failed to delete");
      throw error;
    }

    res.status(200).json({ message: "category deleted successdully" });
  } catch (error) {
    console.log(error);
  }
};

export const findCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const response = (await Category.findByID(id)) as DBResponse;
    if (response.failed) {
      const error = new Error("could not get category");
      throw error;
    }

    res.status(200).json({ message: "found category", data: response.rows });
  } catch (error) {
    console.log(error);
  }
};
