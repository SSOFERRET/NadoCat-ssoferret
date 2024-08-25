import React, { useState } from 'react';
import { useAddFavoriteCat, useDeleteFavoriteCat } from '../../hooks/useStreetCat';
import { GoHeartFill } from "react-icons/go";

interface IFavoriteButtonProps {
  postId: number;
  like: number;
  onToggle?: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<IFavoriteButtonProps> = ({ postId, like, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState<number>(like);

  const addFavoriteMutation = useAddFavoriteCat();
  const deleteFavoriteMutation = useDeleteFavoriteCat();

  const toggleFavorite = () => {
    if (isFavorite) {
      deleteFavoriteMutation.mutate(postId, {
        onSuccess: () => {
          setIsFavorite(0);
          if (onToggle) {return onToggle(false)}
        },
        onError: (error) => {
          console.error("Failed to remove favorite", error);
        },
      });
    } else {
      addFavoriteMutation.mutate(postId, {
        onSuccess: () => {
          setIsFavorite(1);
          if (onToggle) {return onToggle(true)}
        },
        onError: (error) => {
          console.error("Failed to add favorite", error);
        },
      });
    }
  };

  return (
    <GoHeartFill
      className={`like ${isFavorite ? "active" : ""}`}
      onClick={toggleFavorite}
    />
  );
};

export default FavoriteButton;
