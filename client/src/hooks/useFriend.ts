import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFriend, deleteFriend } from "../api/friend.apit";

const useFriend = () => {
  const queryClient = useQueryClient();

  const { mutate: follow } = useMutation({
    mutationFn: (followingId: string) => addFriend(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      console.error("Error adding friend:", error);
    },
  });

  const { mutate: unfollow } = useMutation({
    mutationFn: (followingId: string) => deleteFriend(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      console.error("Error deleting friend:", error);
    },
  });

  return {
    follow,
    unfollow,
  };
};

export default useFriend;
