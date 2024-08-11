import { Prisma } from "@prisma/client";
import { ILocation } from "../types/location";

export const addLocation = async (
  tx: Prisma.TransactionClient,
  location: ILocation
) => {
  return await tx.locations.create({
    data: {
      ...location,
      detail: location.detail || ""
    },
  });
}

export const deleteLocations = async (
  tx: Prisma.TransactionClient,
  locationIds: number[]
) => {
  return await tx.locations.deleteMany({
    where: {
      locationId: {
        in: locationIds
      }
    }
  })
}

export const updateLocationById = async (
  tx: Prisma.TransactionClient,
  locationId: number,
  location: ILocation
) => {
  return await tx.locations.update({
    where: {
      locationId
    },
    data: location
  })
}

export const getLocationById = async (
  tx: Prisma.TransactionClient,
  locationId: number
) => {
  return await tx.locations.findUnique({
    where: {
      locationId
    }
  })
};