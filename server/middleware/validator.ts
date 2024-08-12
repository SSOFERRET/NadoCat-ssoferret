import { NextFunction, Request, Response } from "express";
import { validationResult, body } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

export const signupValidator = [
  body("email").isEmail().withMessage("유효한 이메일 주소를 입력해주세요."),
  body("pasword")
    .isLength({ min: 8 })
    .withMessage("비밀번호는 최소 8자 이상이어야 합니다."),
  body("nickname").notEmpty().withMessage("닉네임을 입력해주세요"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({ message: errors.array() });
  },
];

export const loginValidator = [
  body("email").notEmpty().withMessage("이메일 주소를 입력해주세요."),
  body("pasword").notEmpty().withMessage("비밀번호를 입력해주세요."),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({ message: errors.array() });
  },
];