import prisma from "../../client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { addLocation, getLocationById, updateLocationById } from "../../model/location.model";
import {
  addMissing,
  addLocationFormats,
  removePost,
  updateMissingByPostId,
  updateFoundByPostId,
  getMissingReportsByMissingId,
  getPostByPostId,
  getLocationFormatsByPostId,
  getImageFormatsByPostId,
  addMissingCat,
  updateMissingCatByCat,
  addImageFormats,
  removeImagesByIds,
} from "../../model/missing.model";
import { CATEGORY } from "../../constants/category";
import { addNewImages } from "../../util/images/addNewImages";
import { deleteImagesByImageIds, getAndDeleteImageFormats } from "../../util/images/deleteImages";
import { deleteLocationsByLocationIds, getAndDeleteLocationFormats } from "../../util/locations/deleteLocations";
import { deleteMissingReport } from "./MissingReports";
import { deleteImages, getImageById } from "../../model/image.model";
import { PAGINATION } from "../../constants/pagination";
import { getPosts } from "./Common";
import { getMissingFavoriteAdders, getMissingReporters } from "../../model/notification.model";
import { notify, notifyNewPostToFriends } from "../notification/Notifications";
import { incrementViewCountAsAllowed } from "../common/Views";
import { deleteImageFromS3ByImageId, uploadImagesToS3 } from "../../util/images/s3ImageHandler";
import { ILocation } from "../../types/location";
import { handleControllerError } from "../../util/errors/errors";
import { deleteOpensearchDocument, indexOpensearchDocument, updateOpensearchDocument } from "../search/Searches";
import { getUser } from "../../model/my.model";

/* CHECKLIST
 * [ ] 사용자 정보 가져오기 반영
 * [x] 구현 내용
 *   [x] create
 *   [x] delete
 *   [x] get
 *   [x] put
 */

const getOrderBy = (sort: string) => {
  switch (sort) {
    case "latest":
      return { sortBy: "createdAt", sortOrder: "asc" };
    case "oldest":
      return { sortBy: "createdAt", sortOrder: "desc" };
    default:
      throw new Error("일치하는 정렬 기준이 없습니다.");
  }
};

export const getMissings = async (req: Request, res: Response) => {
  const sort = "latest";

  const listData = {
    limit: Number(req.query.limit) || PAGINATION.LIMIT,
    cursor: req.query.cursor ? Number(req.query.cursor) : undefined,
    orderBy: getOrderBy(sort),
    categoryId: CATEGORY.MISSINGS,
  };

  return await getPosts(req, res, listData);
};

/**
 *
 * CHECKLIST
 * [x] 이미지 가져오기
 * [x] location 가져오기
 */

export const getMissing = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.postId);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const postData = {
        postId,
        categoryId: CATEGORY.MISSINGS,
      };

      let post = await getPostByPostId(tx, postData);
      const userId = post.users.uuid.toString("hex");
      post.users = { ...post.users, userId };
      const imagesFormats = await getImageFormatsByPostId(tx, postData);
      const images = await Promise.all(
        imagesFormats?.map(async (format) => await getImageById(tx, format.imageId)) || []
      );

      // const reportCount = await getReportCount(postId);

      const viewIncrementResult = await incrementViewCountAsAllowed(req, tx, CATEGORY.MISSINGS, postId);
      post.views += viewIncrementResult || 0;

      if (images[0]) {
        await indexOpensearchDocument(CATEGORY.MISSINGS, post.postId, {
          nickname: post.users.nickname,
          cat: post.missingCats.name,
          detail: post.missingCats.detail,
          location: post.locations.detail,
          time: post.time,
          profile: post.users.profileImage,
          thumbnail: images[0].url,
          postId: postId,
          found: post.found,
          createdAt: post.createdAt
        });
      }


      return res.status(StatusCodes.OK).json({ ...post, images });
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error)
      validateError(res, error);
  }
};

/**CHECKLIST
 * [x] missing_locations table에 추가 누락
 */

export const createMissing = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const missing = JSON.parse(req.body.missing);
    const cat = JSON.parse(req.body.cat);
    const location = JSON.parse(req.body.location);

    const newPost = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newLocation = await addLocation(tx, location as ILocation);

      const userId = Buffer.from(uuid, "hex");

      const catData = {
        ...cat,
        uuid: userId,
      };
      const missingCat = await addMissingCat(tx, catData);

      const post = await addMissing(tx, {
        ...missing,
        catId: missingCat.missingCatId,
        uuid: userId,
        time: new Date(missing.time),
        locationId: newLocation.locationId,
      });

      await addLocationFormats(tx, CATEGORY.MISSINGS, {
        postId: post.postId,
        locationId: newLocation.locationId,
      });

      let imageUrls: string[] = [];

      if (req.files) {
        imageUrls = await uploadImagesToS3(req) as string[];
        await addNewImages(tx, {
          userId,
          postId: post.postId,
          categoryId: CATEGORY.MISSINGS,
        }, imageUrls);
      }

      const user = await getUser(uuid);

      await indexOpensearchDocument(CATEGORY.MISSINGS, post.postId, {
        nickname: user?.selectUser.nickname,
        cat: missingCat.name,
        location: newLocation.detail,
        time: post.time,
        profile: user?.selectUser.profileImage,
        thumbnail: imageUrls[0],
        postId: post.postId,
        found: false,
        createdAt: post.createdAt
      });

      await notifyNewPostToFriends(userId, CATEGORY.MISSINGS, post.postId);
      return { ...post, thumbnail: imageUrls[0] };
    });

    res.status(StatusCodes.CREATED).send({ postId: newPost.postId as number });
  } catch (error) {
    console.error(error)
    if (error instanceof Error)
      validateError(res, error);
  }
};

/**
 * CHECKLIST
 * [x] location 삭제
 * [x] images 삭제
 * [x] 제보글 삭제
 *
 * */

export const deleteMissing = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const userId = Buffer.from(uuid, "hex");
    const postId = Number(req.params.postId);
    const postData = {
      userId,
      postId,
      categoryId: CATEGORY.MISSINGS,
    };

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const missingReports = await getMissingReportsByMissingId(tx, postId);

      if (missingReports)
        await Promise.all(missingReports.map((report) => deleteMissingReport(req, res, report.postId)));

      const locations = await getAndDeleteLocationFormats(tx, postData);
      const images = await getAndDeleteImageFormats(tx, postData);

      await removePost(tx, postData);

      if (locations) await deleteLocationsByLocationIds(tx, locations);

      if (images) await deleteImagesByImageIds(tx, images);

      await deleteOpensearchDocument(CATEGORY.MISSINGS, postId);
    });

    return res.status(StatusCodes.OK).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return validateError(res, error);
  }
};

/**
 * CHECKLIST
 * Update
 * [x] 이미지 수정
 * [x] 위치 수정
 * [x] 내용 수정
 *
 * [x] 상태 수정
 * [ ] 조회수 업데이트?
 */
export const updateMissing = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const postId = Number(req.params.postId);
    const userId = Buffer.from(uuid, "hex");

    const missing = JSON.parse(req.body.missing);
    const cat = JSON.parse(req.body.cat);
    const location = JSON.parse(req.body.location);
    const imageIds = JSON.parse(req.body.deleteImageIds);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const oldPost = await getPostByPostId(tx, { categoryId: CATEGORY.MISSINGS, postId });
      await updateMissingByPostId(tx, postId, userId, missing);

      await updateMissingCatByCat(tx, oldPost.missingCats.missingCatId, cat);

      await deleteImageFromS3ByImageId(tx, imageIds);

      await removeImagesByIds(tx, imageIds);

      await deleteImages(tx, imageIds);

      if (req.files) {
        const imageUrls = (await uploadImagesToS3(req)) as any;
        await addNewImages(
          tx,
          {
            userId,
            postId,
            categoryId: CATEGORY.MISSINGS,
          },
          imageUrls
        );
      }
      await updateOpensearchDocument(CATEGORY.MISSINGS, postId, {
        content: missing.detail
      })
    });


    res.status(StatusCodes.OK).json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const validateBadRequest = (res: Response, error: Error) => {
  console.error(error);
  return res.status(StatusCodes.BAD_REQUEST).json({ message: "입력값을 확인해 주세요." });
};

export const validateInternalServerError = (res: Response) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
};

export const validateError = (res: Response, error: Error) => {
  if (error instanceof Prisma.PrismaClientValidationError) return validateBadRequest(res, error);
  return validateInternalServerError(res);
};

export const updateFoundState = async (req: Request, res: Response) => {
  const uuid = req.user?.uuid;
  try {
    if (!uuid) {
      throw new Error("User UUID is missing.");
    }
    const userId = Buffer.from(uuid, "hex");
    const postId = Number(req.params.postId);
    const { found } = req.body;
    const postData = {
      postId,
      userId,
      categoryId: CATEGORY.MISSINGS,
    };

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await updateFoundByPostId(tx, postData, found);

      const receivers = [...(await getMissingReporters(tx, postId)), ...(await getMissingFavoriteAdders(tx, postId))];


      receivers.forEach((receiver) => notify({
        type: "found",
        receiver: receiver.uuid.toString("hex"),
        sender: userId.toString("hex"),
        url: `/boards/missings/${postId}`,
      }))
    })

    return res.status(StatusCodes.OK).json({ message: "게시글이 상태가 변경 되었습니다." });
  } catch (error) {
    if (error instanceof Error) return validateError(res, error);
  }
};
