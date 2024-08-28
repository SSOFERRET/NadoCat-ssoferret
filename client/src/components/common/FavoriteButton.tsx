import React, { useState } from 'react';
import { useAddFavoriteCat, useDeleteFavoriteCat } from '../../hooks/useStreetCat';
import { GoHeartFill } from "react-icons/go";
import { useAuthStore } from "../../store/userStore";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

interface IFavoriteButtonProps {
  postId: number;
  like: number;
  onToggle?: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<IFavoriteButtonProps> = ({ postId, like, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState<number>(like);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { uuid } = useAuthStore();

  const addFavoriteMutation = useAddFavoriteCat();
  const deleteFavoriteMutation = useDeleteFavoriteCat();

  const toggleFavorite = () => {
    if (!uuid) {
      setModalOpen(true)
      return;
    }

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

  const handleModalClose = () => {
    setModalOpen(false);
  }

  return (
    <>
      <GoHeartFill
        className={`like ${isFavorite ? "active" : ""}`}
        onClick={toggleFavorite}
      />
      <Modal
        isOpen={modalOpen}
        onClosed={handleModalClose}
        actionTitle="로그인 하기"
        textf="로그인이 필요합니다."
        textl="로그인 하시겠습니까?"
        onClickAction={() => {
          navigate("/users/login")
        }}
      />
    </>
  );
};

export default FavoriteButton;
