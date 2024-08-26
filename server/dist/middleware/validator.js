"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signupValidator = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ message: errors.array()[0].msg });
};
exports.validate = validate;
exports.signupValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("유효한 이메일 주소를 입력해주세요."),
    (0, express_validator_1.body)("password")
        .isLength({ min: 4 })
        .withMessage("비밀번호는 최소 4자 이상이어야 합니다."),
    (0, express_validator_1.body)("password").notEmpty().withMessage("비밀번호를 입력해주세요"),
    (0, express_validator_1.body)("nickname").notEmpty().withMessage("닉네임을 입력해주세요"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(400).json({ message: errors.array() });
    },
];
exports.loginValidator = [
    (0, express_validator_1.body)("email").notEmpty().withMessage("이메일 주소를 입력해주세요."),
    (0, express_validator_1.body)("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(400).json({ message: errors.array() });
    },
];
