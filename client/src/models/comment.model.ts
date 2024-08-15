export interface IComment {
  commentId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  users: {
    uuid: string;
    nickname: string;
    profileImage: string;
  };
}
