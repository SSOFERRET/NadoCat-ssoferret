import prisma from "../client";

type PostCategory = "communities" | "events";

// const findPostInCategory = async (category: PostCategory, postId: number) => {
//   switch (category) {
//     case "communities":
//       return await prisma.communities.findUnique({
//         where: { postId: postId },
//         select: { title: true, content: true, views: true, createdAt: true, thumbnail: true }
//       });
//     case "events":
//       return await prisma.events.findUnique({
//         where: { postId: postId },
//         select: { title: true, content: true, views: true, createdAt: true, thumbnail: true, isClosed: true }
//       });
//     default:
//       return null;
//   }
// };

const findPostInCategory = async (category: PostCategory, postId: number) => {
  let data;
  switch (category) {
    case "communities":
      data = await prisma.communities.findUnique({
        where: { postId: postId },
        select: {
          title: true,
          content: true,
          views: true,
          createdAt: true,
          communityImages: {
            select: {
              images: {
                select: {
                  imageId: true,
                  url: true,
                },
              },
            },
          },
        },
      });

      return {
        title: data?.title,
        content: data?.content,
        views: data?.views,
        createdAt: data?.createdAt,
        thumbnail: data?.communityImages.map((item) => item.images.url).join("") ?? null,
      };

    case "events":
      data = await prisma.events.findUnique({
        where: { postId: postId },
        select: {
          title: true,
          content: true,
          views: true,
          createdAt: true,
          eventImages: {
            select: {
              images: {
                select: {
                  imageId: true,
                  url: true,
                },
              },
            },
          },
        },
      });
      return {
        title: data?.title,
        content: data?.content,
        views: data?.views,
        createdAt: data?.createdAt,
        thumbnail: data?.eventImages.map((item) => item.images.url).join("") ?? null,
      };
    default:
      return null;
  }
};

export const interest = async (uuid: Buffer) => {
  const interestPosts = await prisma.likes.findMany({
    where: {
      uuid: uuid,
    },
    select: {
      postId: true,
      categoryId: true,
    },
  });

  const categories = await prisma.boardCategories.findMany({
    where: {
      categoryId: {
        in: interestPosts.map((post) => post.categoryId),
      },
    },
    select: {
      categoryId: true,
      category: true,
    },
  });

  const categoryMap = new Map<number, PostCategory>(
    categories.map((cat) => [cat.categoryId, cat.category as PostCategory])
  );

  const posts = await Promise.all(
    interestPosts.map(async (interestPost) => {
      const category = categoryMap.get(interestPost.categoryId);
      if (!category) {
        return null;
      }
      return await findPostInCategory(category, interestPost.postId);
    })
  );

  return posts.filter((post) => post !== null);
};
