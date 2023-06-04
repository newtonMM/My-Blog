import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
interface RequestWithUserId extends Request {
  userId?: Record<string, any>;
}

const isAuth = async (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const token = req.session.token;
  console.log(token);

  if (!token) {
    const error = new Error("Not authorized");
    throw error;
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    if (!decodedToken) {
      const error = new Error("Not authenticated");
      throw error;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuth;
