import React from "react";
import { describe, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Avatar from "../../components/common/Avatar";

describe("Avatar", () => {
  const users = {
    id: 8,
    nickname: "춘식이",
    profileImage: "https://nadocat.s3.ap-northeast-2.amazonaws.com/profileCat_default.png",
    uuid: "e9db3b4b828b465db99b2f11f9b5b6e2",
  };

  it("Avatar 렌더링", () => {
    render(<Avatar profileImage={users.profileImage} nickname={users.nickname} />);
    const avatarImage = screen.getByRole("img") as HTMLImageElement;
    expect(avatarImage.src).toBe(users.profileImage);
  });

  it("프로필 이미지를 클릭하면 onClick 이벤트 호출", () => {
    const onClick = vi.fn();
    render(<Avatar profileImage={users.profileImage} nickname={users.nickname} onClick={onClick} />);
    const avatarDiv = screen.getByRole("img").closest("div");
    if (avatarDiv) {
      fireEvent.click(avatarDiv);
      expect(onClick).toHaveBeenCalledTimes(1);
    }
  });

  it("size props에 값에 따라 size 값과 같은 class를 가져야 함", () => {
    render(<Avatar profileImage={users.profileImage} nickname={users.nickname} size="sm" />);
    const avatarDiv = screen.getByRole("img").closest("div");
    if (avatarDiv) {
      expect(avatarDiv).toHaveClass("sm");
    }
  });
});
