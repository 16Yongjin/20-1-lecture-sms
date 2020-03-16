import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";

export const checkLectureParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.query.courseId) next(new HTTP400Error("Missing courseId parameter"));
  else next();
};

export const checkLectureSearchParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.query.name)
    next(new HTTP400Error("검색할 강의 이름을 입력해주세요."));
  else next();
};

export const checkFindUserParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.query.id) next(new HTTP400Error("Missing id parameter"));
  else next();
};

export const checkAddUserAlarmBody = async (
  { body: { userId, lectureId } }: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!userId || !lectureId)
    next(new HTTP400Error("Missing userId or lectureId"));
  else next();
};

export const checkDeleteUserAlarmBody = async (
  { params: { userId, lectureId } }: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!userId || !lectureId)
    next(new HTTP400Error("Missing userId or lectureId"));
  else next();
};

export const checkId = async (
  { params: { id } }: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!id || !/^010\d{8}$/.test(id))
    next(new HTTP400Error("올바른 전화번호를 입력해주세요."));
  else next();
};
