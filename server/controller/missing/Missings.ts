import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const getMissings = async (req: Request, res: Response) => {
  try {
    const results = await prisma.missings.findMany({
      include: {
        boardCategories: true,
        users: true,
        locations: true,
      }
    });
    res.json(results);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};