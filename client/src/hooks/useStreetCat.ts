import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFavoriteCat, createStreetCatPost, deleteFavoriteCat, deleteStreetCatComment, deleteStreetCatPost, getStreetCatMap, getStreetCatPost, updateStreetCatPost } from "../api/streetCat.api";

interface IStreetCatDetailParams {
  postId: number;
}

interface IStreetCatCommentParams {
  postId: number;
  commentId: number;
}

interface IStreetCatEdit {
  formData: FormData;
  postId: number;
}

export const useReadStreetCatPost = (postId: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["streetCatDetail", postId],
    queryFn: () => getStreetCatPost({ postId })
  });

  return {
    data,
    isLoading
  }
}

export const useAddStreetCatPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createStreetCatPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Error creating street cat post:", error);
    },
  });
};

export const useUpdateStreetCatPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, postId }: IStreetCatEdit) => updateStreetCatPost(formData, postId),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Error creating street cat post:", error);
    },
  });
};

export const useDeleteStreetCatPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: IStreetCatDetailParams) => deleteStreetCatPost({ postId }),
    onSuccess: () => {
      queryClient.removeQueries();
    },
    onError: (error) => {
      console.error("Error deleting street cat post:", error);
    },
  });
};

export const useAddFavoriteCat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavoriteCat,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export const useDeleteFavoriteCat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavoriteCat,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: IStreetCatCommentParams) => deleteStreetCatComment({ postId, commentId }),
    onSuccess: (_, { postId, commentId }) => {
      queryClient.removeQueries({ queryKey: ["deleteStreetCatComment", { postId, commentId }] });
    },
    onError: (error) => {
      console.error("deleteStreetCatComment :", error);
    },
  });
};

export const useReadStreetMap = () => {
  console.log("use - useReadStreetMap()")
  const {data} = useQuery({
    queryKey: ["streetCatMap"],
    queryFn: () => getStreetCatMap()
  });

  console.log("use", data)

  return {
    data
  }
}