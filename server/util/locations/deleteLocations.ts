import { Prisma } from "@prisma/client";
import { deleteLocationFormats, getLocationFormatsByPostId } from "../../model/missing.model";
import { IPostData } from "../../types/post";
import { ILocationBridge } from "../../types/location";
import { deleteLocations } from "../../model/location.model";

export const getAndDeleteLocationFormats = async (
  tx: Prisma.TransactionClient,
  postData: IPostData
) => {
  const locations = await getLocationFormatsByPostId(tx, postData);
  await deleteLocationFormats(tx, postData);
  return locations;
}

export const deleteLocationsByLocationIds = async (
  tx: Prisma.TransactionClient,
  locations: ILocationBridge[]
) => {
  const formattedLocations = locations.map((location) => location.locationId);
  return await deleteLocations(tx, formattedLocations);
}