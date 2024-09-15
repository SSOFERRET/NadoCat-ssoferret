import { Prisma } from "@prisma/client";
import { getCategoryUrlStringById } from "../../constants/category";
import { SEARCH } from "../../constants/search";
import { TCategoryId } from "../../types/category";
import { Request, Response } from "express";
import prisma from "../../client";
import { getCommunityById } from "../../model/community.model";
import { getEventById } from "../../model/event.model";
import { getMissingById, getPostByPostId } from "../../model/missing.model";
import { getStreetCat } from "../streetCat/StreetCats";
import { getStreetCatById, getStreetCatForOpenSearchData, readPost } from "../../model/streetCat.model";
import { StatusCodes } from "http-status-codes";
import opensearch from "../../opensearch";

const getId = (categoryId: TCategoryId, postId: number) => `${categoryId}_${postId}`;

const getDataForSearch = (categoryId: TCategoryId, postId: number) => {
  return {
    categoryName: getCategoryUrlStringById(categoryId),
    documentId: getId(categoryId, postId)
  }
}

export const searchDocuments = async (req: Request, res: Response) => {
  // console.log("searchDocuments function called");
  const { query } = req.query;
  try {
    const searchCategoryList = [1, 2, 3, 5].map((id) => getCategoryUrlStringById(id as TCategoryId))

    const results = await Promise.all(
      searchCategoryList.map(async (categoryName) => {
        // console.log(categoryName)
        try {
          const result = await opensearch.search({

            index: categoryName,
            body: {
              track_total_hits: true,
              query: {
                query_string: {
                  query: `*${query}*`,  // 검색어 포함하는 결과
                  fields: ["content", "title", "detail", "name", "missingCats.name", "locations.detail", "location.detail", "tags.tag"]
                }
              }
            },
            size: SEARCH.SIZE
          });
          return {
            category: categoryName,
            search: result.body.hits.hits,
            totalcount: result.body.hits.total
          };
        } catch (error) {
          console.error(error);
          return;
        }
      })
    );
    console.log(results)
    res.status(200).json(results);
  } catch (error) {
    console.error('OpenSearch search error:', error);
    res.status(500).send('Error searching documents');
  }
};

// export const indexOpensearchDocument = async (categoryId: TCategoryId, nickname: string, title: string, content: string, postId: number, timestamp: string, profile?: string, image?: string, tag?: string[]) => {
//   try {
//     const { categoryName, documentId } = getDataForSearch(categoryId, postId);

//     const response = await opensearch.index({
//       index: categoryName,
//       id: documentId,
//       body: {
//         nickname,
//         profile,
//         title,
//         content,
//         url: `/boards/${categoryName}/${postId}`,
//         image,
//         tag,
//         timestamp
//       }
//     });
//     console.log('Document indexed:', response);
//   } catch (error) {
//     console.error('Error indexing document:', error);
//   }
// };

export const indexOpensearchDocument = async (categoryId: TCategoryId, postId: number, post: any) => {
  try {
    const { categoryName, documentId } = getDataForSearch(categoryId, postId);

    await opensearch.index({
      index: categoryName,
      id: documentId,
      body: post
    });
  } catch (error) {
    console.error('Error indexing document:', error);
  }
};

export const updateOpensearchDocument = async (categoryId: TCategoryId, postId: number, data: any) => {
  try {
    const { categoryName, documentId } = getDataForSearch(categoryId, postId);

    const response = await opensearch.update({
      index: categoryName,
      id: documentId,
      body: {
        doc: data
      }
    });
    console.log('Document updated:', response);
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

export const deleteOpensearchDocument = async (categoryId: TCategoryId, postId: number) => {
  try {
    const { categoryName, documentId } = getDataForSearch(categoryId, postId);

    const response = await opensearch.delete({
      index: categoryName,
      id: documentId
    });
    console.log('Document deleted:', response);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

export const indexResultToOpensearch = async (categoryId: TCategoryId, postId: number) => {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    let postDataForOpensearch;

    switch (categoryId) {
      case 1:
        postDataForOpensearch = await getCommunityById(tx, postId);
        console.log(postDataForOpensearch)
        break;
      case 2:
        postDataForOpensearch = await getEventById(tx, postId);
        break;
      case 3:
        postDataForOpensearch = await getPostByPostId(tx, { categoryId, postId });
        break;
      case 5:
        postDataForOpensearch = await getStreetCatForOpenSearchData(postId);
        break;
      default:
        throw new Error("유효하지 않은 카테고리 ID");
    }

    if (!postDataForOpensearch) throw new Error("포스트 없다");
    await indexOpensearchDocument(categoryId, postId, postDataForOpensearch);
  });
};

export const searchDocumentsPagination = async (req: Request, res: Response) => {
  const { query, page = 1, pageSize = 10, category } = req.query;

  const pageNumber = parseInt(page as string, 10) || 1;
  const size = parseInt(pageSize as string, 10) || 10;
  const from = (pageNumber - 1) * size;

  try {
    const result = await opensearch.search({
      index: category as string,
      body: {
        track_total_hits: true,
        query: {
          bool: {
            should: [
              { match: { content: query } },
              { match: { title: query } },
              { match: { detail: query } },
              { match: { name: query } },
              { match: { "missingCats.name": query } },
              { match: { "locations.detail": query } },
              { match: { "location.detail": query } },
              { match: { "tags.tag": query } },
              { match: { tags: query } },
            ],
          },
        },
      },
      from,
      size,
    });

    res.status(StatusCodes.OK).json({
      category: category,
      search: result.body.hits.hits,
      totalcount: result.body.hits.total,
    });
  } catch (error) {
    console.log(`No ${category}`, error);
    res.status(StatusCodes.BAD_REQUEST).json({
      category: category,
      search: [],
      totalcount: { value: 0 },
    });
  }
}
