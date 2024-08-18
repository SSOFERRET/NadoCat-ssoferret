import { Request, Response } from "express";
import { createClient, RedisClientType } from "redis";
import connectRedis from "../../redis";
import { getTimestamp } from "../../util/time/timestamp";
import { updateView } from "../../model/common/view.model";
import { Prisma } from "@prisma/client";
import { TCategoryId } from "../../types/category";

const VIEW_LIMIT_SEC = 21600; // 6시간

export const incrementViewCountAsAllowed = async (req: Request, tx: Prisma.TransactionClient, categoryId: TCategoryId, postId: number) => {
  const userIp: string = req.ip as string;
  const key: string = getKeyName(categoryId, postId);
  const field: string = getFieldName(userIp);
  const redis: RedisClientType = await connectRedis();

  try {
    const isIncrementAllowed: boolean = await isViewIncrementAllowed(userIp, redis, key, field);
    if (isIncrementAllowed) {
      await updateView(tx, categoryId, postId);
      return await redis.hSet(key, field, getTimestamp());
    }
  } catch (error) {
    throw new Error("incrementViewCountAsAllowed Error");
  }
}

const getKeyName = (categoryId: number, postId: number) => `views_${categoryId}_${postId}`;

const getFieldName = (userId: string) => `userId_${userId}`;

const isViewIncrementAllowed = async (userIp: string, redis: RedisClientType, key: string, field: string): Promise<boolean> => {
  const timestamp = getTimestamp()

  try {
    const viewCheck = await checkView(redis, key, field);
    const enoughTimePassed = timestamp - await getLastViewTime(redis, key, field) > VIEW_LIMIT_SEC;

    return !viewCheck || enoughTimePassed;
  } catch (error) {
    console.log("isViewIncrementAllowed:", error);
    throw new Error("isViewIncrementAllowed Error");
  }
}

const checkView = async (redis: RedisClientType, key: string, field: string) => {
  return await redis.hExists(key, field);
}

const getLastViewTime = async (redis: RedisClientType, key: string, field: string): Promise<number> => {
  const stringData = await redis.hGet(key, field);
  return Number(stringData);
}