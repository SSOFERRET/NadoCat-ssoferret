import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMissingReportPost, deleteMissingReport, getMissingReport, updateMatch, updateMissingReportPost } from "../api/missing.api";
import { Buffer } from 'buffer';

interface IMissingReportPostParams {
  formData: FormData;
  postId: number;
}

interface IMissingReportIdPostParams extends IMissingReportPostParams {
  reportId: number
}

export const useAddMissingReportPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, postId }: IMissingReportPostParams) => createMissingReportPost(postId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Error creating missing report post:", error);
    },
  });
};

export const useUpdateMissingReportPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, postId, reportId }: IMissingReportIdPostParams) => updateMissingReportPost(postId, formData, reportId),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Error updating missing report post:", error);
    },
  });
};

export const useReadMissingReport = (postId: number, reportId: number) => {
  const { data } = useQuery({
    queryKey: ["missingReport", postId, reportId],
    queryFn: () => getMissingReport({ postId, reportId })
  });

  return {
    data
  };
}

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, reportId, match }: { postId: number, reportId: number, match: string }) => updateMatch(postId, reportId, match),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Error updating missing report post:", error);
    },
  });
};

export const useDeleteMissingReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, reportId }: { postId: number, reportId: number }) => deleteMissingReport({ postId, reportId }),
    onSuccess: (_, { reportId }) => {
      queryClient.removeQueries({ queryKey: ["missingDetail", reportId] });
    },
    onError: (error) => {
      console.error("Error deleting Missing post:", error);
    },
  });
};



export const useCompareUsers = (loginUser: string, ownerUser: any, postUser: any) => {
  // ownerUser와 postUser를 Buffer로 변환
  const ownerUserBuffer = Buffer.isBuffer(ownerUser) ? ownerUser : Buffer.from(ownerUser.data);
  const postUserBuffer = Buffer.isBuffer(postUser) ? postUser : Buffer.from(postUser.data);

  // Buffer 데이터를 문자열로 변환하여 비교
  const isOwnerUser = () => loginUser === ownerUserBuffer.toString('hex');
  const isPostUser = () => loginUser === postUserBuffer.toString('hex');

  return { isOwnerUser, isPostUser };
};