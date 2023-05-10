import { NextFunction, Response, Request } from "express";
import { User } from "../models/user";
import { IUser } from "../types/IUser";
import { v4 as generateId } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

interface ISavedUser {
  id: number;
  username: string;
  password: string;
  user_id: string;
}
interface DBResponse {
  code: string;
  failed: boolean;
  message: string;
  rows: {
    affectedRows: number;
  };
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   if (!req.body) {
  //     const error = new Error("not request");
  //     throw error;
  //   }
  console.log(req.body);

  const {
    first_name,
    last_name,
    email,
    password,
    cover_image_url,
    profile_image_url,
    username,
  }: IUser = req.body;

  const usernameTaken = await User.findUserByUserName(username);
  if (usernameTaken) {
    const error = new Error("username already exist");
    throw error;
  }

  try {
    const id = generateId();
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);
    const user = new User(
      id,
      first_name,
      last_name,
      email,
      hashedPw,
      username,
      cover_image_url,
      profile_image_url
    );
    const userD = await user.save();
    if (!userD) {
      const error = new Error("an error ocurred");
      throw error;
    }
    res.status(200).json({ message: "user saved successfulyy" });
  } catch (error) {
    throw error;
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = (await User.findUserByUserName(username)) as ISavedUser;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("you have entered the wrong password");
      throw error;
    }
    const token = jwt.sign(
      {
        username: user.username,
        userId: user.user_id,
      },
      process.env.JWT_SECRET_KEY!
    );
    if (!token) {
      const error = new Error("could not generate token");
      throw error;
    }

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    first_name,
    last_name,
    email,
    username,
    cover_image_url,
    profile_image_url,
  } = req.body;
  const { userId } = req.params;

  try {
    const updatedDetails = {
      last_name,
      first_name,
      email,
      username,
      cover_image_url,
      profile_image_url,
    };
    const updateResults = (await User.updateUserDetails(
      updatedDetails,
      userId
    )) as DBResponse;
    if (updateResults.failed || !updateResults) {
      console.log(updateResults);
      const error = new Error("updated failed");
      throw error;
    }
    console.log(updateResults);

    res.status(200).json({ message: "Updated user successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = (await User.deleteUser(id)) as DBResponse;

    if (response.failed || response.rows.affectedRows === 0) {
      const error = new Error("failed to delete");
      throw error;
    }

    res.status(200).json({ message: "user deleted successdully" });
  } catch (error) {
    console.log(error);
  }
};

export const findAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = (await User.findAll()) as DBResponse;
    if (response.failed || !response.rows) {
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

export const findUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const response = (await User.findByID(id)) as DBResponse;
    if (response.failed || !response.rows) {
      const error = new Error("could not delete");
      throw error;
    }

    res.status(200).json({ message: "found user", data: response.rows });
  } catch (error) {
    console.log(error);
  }
};
