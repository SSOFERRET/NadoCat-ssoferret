import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, {JwtPayload}  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//[x]jwt 복호화
export const ensureAutorization = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers["authorization"]; 
    console.log("auth------------: ", auth);
    
    if (auth && auth.startsWith("Bearer ")) {
        const receivedJwt = auth.substring(7);
        const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY_GEN as string) as JwtPayload;
        console.log("decodedJwt------------: ", decodedJwt);
      req.user = decodedJwt;
      next();
      
    } else {
      throw new ReferenceError("잘못된 jwt 형식입니다.");
    }
  } catch (error) {
    return error;
  }
};

