import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";

export const handleControllerError = (error: any, res: Response) => {
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025" || error.code === "P2003") {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "해당 정보를 찾을 수 없습니다." });
    }
  }

  res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
};
