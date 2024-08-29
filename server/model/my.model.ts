import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { deleteProfileImages } from "../util/images/deleteImages";
import { addProfileImages } from "../util/images/addNewImages";
import { ICommunity, ICommunityImage } from "../types/community";

const prisma = new PrismaClient();

const selectCommunities = {
  users: {
    select: {
      id: true,
      uuid: true,
      nickname: true,
      profileImage: true,
    },
  },
  communityImages: {
    take: 1, // 각 게시물의 첫 번째 이미지만 가져옴
    select: {
      images: {
        select: {
          imageId: true,
          url: true,
        },
      },
    },
  },
  communityTags: {
    select: {
      tags: {
        select: {
          tagId: true,
          tag: true,
        },
      },
    },
  },
  _count: {
    select: {
      communityLikes: true, // 각 게시물의 좋아요 수를 포함
    },
  },
};

//[x]사용자 조회
export const getUser = async (uuid: string) => {
  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환

  try {
    //사용자 정보 가져오기
    const selectUser = await prisma.users.findFirst({
      where: {
        uuid: uuidBuffer,
      },
    });

    if (!selectUser) {
      //사실 자기정보라 이러면 안되긴 함
      return null;
    }

    return { selectUser };
  } catch (error) {
    throw new Error("마이페이지 사용자 조회에서 오류 발생");
  }
};

// [x]사용자 닉네임 변경
export const updateNewNickname = async (uuid: string, newNickname: string) => {
  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환

  try {
    // 사용자 정보 업데이트
    const updateUser = await prisma.users.update({
      where: {
        uuid: uuidBuffer,
      },
      data: {
        nickname: newNickname,
      },
    });

    return { updateUser };
  } catch (error) {
    throw new Error("마이페이지 사용자 닉네임 업데이트에서 오류 발생");
  }
};

// [x]사용자 자기소개
export const updateNewDetail = async (uuid: string, newDetail: string) => {
  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환

  try {
    // 사용자 정보 업데이트
    const updateUser = await prisma.users.update({
      where: {
        uuid: uuidBuffer,
      },
      data: {
        detail: newDetail,
      },
    });

    return { updateUser };
  } catch (error) {
    throw new Error("마이페이지 사용자 자기소개 업데이트에서 오류 발생");
  } 
};

// [x]사용자 비밀번호 검증
export const getAuthPassword = async (uuid: string) => {
  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환

  try {
    //사용자 정보 가져오기
    const selectUserSecrets = await prisma.userSecrets.findFirst({
      where: {
        uuid: uuidBuffer,
      },
    });

    if (!selectUserSecrets) {
      //사실 자기정보라 이러면 안되긴 함
      return null;
    }

    return { selectUserSecrets };
  } catch (error) {
    throw new Error("마이페이지 사용자 조회에서 오류 발생");
  } 
};

// [x]사용자 비밀번호 변경
export const updateNewPassword = async (uuid: string, newPassword: string) => {
  const hashing = async (password: string) => {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashPassword = await bcrypt.hash(password, salt);
    return { salt, hashPassword };
  };

  const { salt, hashPassword } = await hashing(newPassword);

  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
  try {
    const selectUserSecrets = await prisma.userSecrets.findFirst({
      where: {
        uuid: uuidBuffer,
      },
    });

    if (!selectUserSecrets) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    // 사용자 정보 업데이트
    const updateUser = await prisma.userSecrets.update({
      where: {
        userSecretId: selectUserSecrets.userSecretId,
      },
      data: {
        salt: salt,
        hashPassword: hashPassword,
      },
    });

    return { updateUser };
  } catch (error) {
    throw new Error("마이페이지 사용자 정보 업데이트에서 오류 발생");
  } 
};

//[x]회원탈퇴
export const deleteUserInactive = async (uuid: string) => {
  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환
  try {
    // 사용자 정보 업데이트
    const updateUser = await prisma.users.update({
      where: {
        uuid: uuidBuffer,
      },
      data: {
        status: "inactive",
      },
    });

    return { updateUser };

  } catch (error) {
    throw new Error("회원탈퇴에서 오류 발생");
  } 
};

//[ ]작성글
export const getMyAllPosts = async (uuid: string, page: number, pageSize: number, cursor?: number) => {
  const uuidBuffer = Buffer.from(uuid, "hex"); //바이너리 변환

  try {
    //여러 게시판에서 가져오기

    const communities = await prisma.communities.findMany({
      where: {
        uuid: uuidBuffer,
      },
      take: pageSize, //10 (한번의 요청으로 몇개?)
      skip: cursor ? 1 : 0, //cursor가 있다면 1 건너뛰고, 아니면 0 건너뜀
      cursor: cursor ? { postId: cursor } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: selectCommunities,

    //});  //충돌 헷갈림

    //if (!posts || posts.length === 0) {

    });

    const posts = communities.map((community: ICommunity) => {
      return {
        postId: community.postId,
        categoryId: community.categoryId,
        title: community.title,
        content: community.content,
        views: community.views,
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
        users: {
          id: community?.users.id,
          uuid: (community?.users.uuid as Buffer).toString("hex"),
          nickname: community?.users.nickname,
          profileImage: community?.users.profileImage,
        },
        thumbnail: community.communityImages.map((item: ICommunityImage) => item.images.url).join("") ?? null,
        likes: community._count.communityLikes,
      };
    });

    if (!posts || posts.length === 0) {
      console.log("작성한 글을 찾을 수 없습니다.");
      return null;
    }

    return posts;
  } catch (error) {
    throw new Error("작성글 조회에서 오류 발생");
  }
};

//[x]프로필 이미지 저장 로직 추가
export const addProfileImageFormats = async (uuid: string, imageUrl: string) => {
  await addProfileImages(imageUrl, uuid);
};

//[x]프로필 이미지 삭제 로직 추가(기본이미지 변경)

export const deleteProfileImageFormats = async (uuid: string, imageUrl: string) => {
  await deleteProfileImages(imageUrl, uuid);
};
