import JwtPayload from "jsonwebtoken";

declare module "express-serve-static-core" { //기존 모듈 확장
    interface Request {
        user?: JwtPayload | string; /// req.user에 저장될 타입
    } 
}