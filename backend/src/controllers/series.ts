import { Series } from "../models/series";
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

export const saveSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description } = req.body;

  if (!name || !description) {
    const error = new Error(" entry cannot be empty");
    throw error;
  }
  try {
    const id = generateId();

    const series = new Series(id, name, description);

    const newSeries = (await series.save()) as DBResponse;
    if (newSeries.failed || !newSeries || newSeries.rows.affectedRows === 0) {
      console.log(newSeries);
      const error = new Error("an error occured, could not save");
      throw error;
    }
    res.status(200).json({ message: "saved series successfully " });
  } catch (error) {
    console.log(error);
  }
};

export const updateSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description } = req.body;
  const { id } = req.params;
  if (!req.body || !id) {
    const error = new Error(" category details or the category id are missing");
    throw id;
  }

  try {
    const details = { name, description, id };

    const updateResponse = (await Series.update(details)) as DBResponse;
    if (updateResponse.failed || updateResponse.rows.affectedRows === 0) {
      console.log(updateResponse);
      const error = new Error("an error occured, could not update");
      throw error;
    }
    console.log(updateResponse);
    res.status(200).json({ message: "series  updated" });
  } catch (error) {
    console.log(error);
  }
};

export const findAllSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = (await Series.findAll()) as DBResponse;
    if (response.failed) {
      const error = new Error("could not fetch users");
      throw error;
    }

    res
      .status(200)
      .json({ message: "found all users", response: response.rows });
  } catch (error) {
    console.log(error);
  }
};

export const deleteSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = (await Series.deleteSeries(id)) as DBResponse;

    if (response.failed || response.rows.affectedRows === 0) {
      const error = new Error("failed to delete");
      throw error;
    }

    res.status(200).json({ message: "series deleted successdully" });
  } catch (error) {
    console.log(error);
  }
};

export const findSeries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const response = (await Series.findByID(id)) as DBResponse;
    if (response.failed) {
      const error = new Error("could not get series");
      throw error;
    }

    res.status(200).json({ message: "found series", data: response.rows });
  } catch (error) {
    console.log(error);
  }
};
