import { Prisma } from "@prisma/client";
import { getCategoryUrlStringById } from "../../constants/category";
import { SEARCH } from "../../constants/search";
import { TCategoryId } from "../../types/category";
import { Request, Response } from "express";
import prisma from "../../client";
import { getCommunityById } from "../../model/community.model";
import { getEventById } from "../../model/event.model";
import { getMissingById, getPostByPostId, getPostsCount } from "../../model/missing.model";
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
  const { query } = req.query;
  try {
    const searchCategoryList = [1, 2, 3, 5].map((id) => getCategoryUrlStringById(id as TCategoryId))

    const results = await Promise.all(
      searchCategoryList.map(async (categoryName) => {
        try {
          const result = await opensearch.search({

            index: categoryName,
            body: {
              track_total_hits: true,
              query: {
                query_string: {
                  query: `*${query}*`,
                  fields: ["content", "title", "detail", "name", "location", "tags.tag"]
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
    res.status(200).json(results);
  } catch (error) {
    console.error('OpenSearch search error:', error);
    res.status(500).send('Error searching documents');
  }
};

export const searchDocumentsAsCategory = async (req: Request, res: Response, category: string) => {
  const { limit, cursor, query } = req.query;
  try {
    const results = await opensearch.search({
      index: category,
      body: {
        track_total_hits: true,
        query: {
          query_string: {
            query: `*${query}*`,
            fields: ["content", "title", "detail", "name", "location", "tags.tag"]
          }
        }
      },
      size: Number(limit),
      from: Number(cursor)
    });

    const totalHits = typeof results.body.hits.total === 'number'
      ? results.body.hits.total
      : results.body.hits.total?.value;
    const hitsLength = results.body.hits.hits.length;

    const nextCursor = Number(cursor) + hitsLength < Number(totalHits) ? Number(cursor) + hitsLength : null;

    res.status(StatusCodes.OK).json({
      posts: results.body.hits.hits,
      pagination: {
        totalcount: totalHits,
        nextCursor
      }
    });
  } catch (error) {
    console.error(error);
  }
};

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

    await opensearch.update({
      index: categoryName,
      id: documentId,
      body: {
        doc: data
      }
    });
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

export const deleteOpensearchDocument = async (categoryId: TCategoryId, postId: number) => {
  try {
    const { categoryName, documentId } = getDataForSearch(categoryId, postId);

    await opensearch.delete({
      index: categoryName,
      id: documentId
    });

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