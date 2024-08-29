import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getLikedPostIds, getInterestPosts } from "../../model/interest.model";

export const getInterests = async (req: Request, res: Response) => {
  const userId = req.user?.uuid; //수정된 부분
  try {
    if (!userId) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요." });
    }

    const userUuidBuffer = Buffer.from(userId, 'hex');
    const postIds = await getLikedPostIds(userUuidBuffer);

    if (postIds.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "좋아요한 게시글이 없습니다." });
    }

    const interestPosts = await getInterestPosts(postIds);
    const formattedPosts = interestPosts.map((community) => {
      return {
        postId: community.postId,
        categoryId: community.categoryId,
        title: community.title,
        content: community.content,
        views: community.views,
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
        users: {
          id: community.users.id,
          uuid: (community.users.uuid as Buffer).toString("hex"),
          nickname: community.users.nickname,
          profileImage: community.users.profileImage,
        },
        tags: community.communityTags.map((item) => item.tags),
        thumbnail: community.communityImages.length
          ? community.communityImages[0].images.url
          : null,
        likes: community._count.communityLikes,
      };
    });

    return res.status(StatusCodes.OK).json(formattedPosts);

  } catch (error) {
    console.error("Error fetching interests:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버에 에러가 발생했습니다." });
  }
};
