import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//[x]jwt 복호화
const ensureAutorization = (req: Request, res: Response) => {
  try {
    const auth = req.headers["authorization"]; 
    console.log("auth: ", auth);

    if (auth) {
      const decodedJwt = jwt.verify(auth, process.env.PRIVATE_KEY as string);
      console.log("decodedJwt: ", decodedJwt);
      return decodedJwt;

    } else if (auth && auth.startsWith("Bearer ")) {
      const receivedJwt = auth.substring(7);
      console.log("receivedJwt: ", receivedJwt);

      const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY as string);
      console.log("decodedJwt: ", decodedJwt);
      return decodedJwt;
      
    } else {
      throw new ReferenceError("잘못된 jwt 형식입니다.");
    }
  } catch (error) {
    return error;
  }
};

export default ensureAutorization;
