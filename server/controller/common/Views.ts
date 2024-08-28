import { Request } from "express";
import { RedisClientType } from "redis";
import connectRedis from "../../redis";
import { getTimestamp } from "../../util/time/timestamp";
import { updateView } from "../../model/common/view.model";
import { Prisma } from "@prisma/client";
import { TCategoryId } from "../../types/category";
import dotenv from "dotenv";
dotenv.config();

const VIEW_LIMIT_SEC = 21600; // 6시간

export const incrementViewCountAsAllowed = async (req: Request, tx: Prisma.TransactionClient, categoryId: TCategoryId, postId: number) => {
  const userIp: string = req.ip as string;
  const key: string = getKeyName(categoryId, postId);
  const field: string = getFieldName(userIp);
  const redis: RedisClientType = await connectRedis();

  if (!Number(process.env.REDIS_VIEW)) return;
  try {
    const isIncrementAllowed: boolean = await isViewIncrementAllowed(redis, key, field);
    if (isIncrementAllowed) {
      await updateView(tx, categoryId, postId);
      return await redis.hSet(key, field, getTimestamp());
    }
  } catch (error) {
    throw new Error("incrementViewCountAsAllowed Error");
  }
}

const getKeyName = (categoryId: number, postId: number) => `views_${categoryId}_${postId}`;

const getFieldName = (userIp: string) => `userIp_${userIp}`;

const isViewIncrementAllowed = async (redis: RedisClientType, key: string, field: string): Promise<boolean> => {
  const timestamp = getTimestamp()

  try {
    const viewCheck: boolean = await checkView(redis, key, field);

    if (!viewCheck) return true;

    return timestamp - await getLastViewTime(redis, key, field) > VIEW_LIMIT_SEC;
  } catch (error) {
    throw new Error("isViewIncrementAllowed Error");
  }
}

const checkView = async (redis: RedisClientType, key: string, field: string) => {
  return await redis.hExists(key, field);
}

const getLastViewTime = async (redis: RedisClientType, key: string, field: string): Promise<number> => {
  const stringData = await redis.hGet(key, field);
  console.log(stringData);
  return Number(stringData);
}