import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFriend, deleteFriend, getFriend } from "../api/friend.apit";

interface IProps {
  followingId?: string;
}

const useFriend = ({ followingId }: IProps) => {
  const queryClient = useQueryClient();

  const {
    data: friend,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["friends", followingId],
    queryFn: () => followingId && getFriend(followingId),
  });

  const { mutate: follow } = useMutation({
    mutationFn: (followingId: string) => addFriend(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", followingId] });
    },
    onError: (error) => {
      console.error("Error adding friend:", error);
    },
  });

  const { mutate: unfollow } = useMutation({
    mutationFn: (followingId: string) => deleteFriend(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", followingId] });
    },
    onError: (error) => {
      console.error("Error deleting friend:", error);
    },
  });

  return {
    follow,
    unfollow,
    friend,
    isLoading,
    error,
  };
};

export default useFriend;
