import { logger } from "./../../utils/logger";
import { sendSMS } from "./../../utils/sendSMS";
import redis from "redis";
import { setAsync, getAsync, client, SETEX } from "./../../redis/index";
import { sendFcm } from "./../../utils/fcmSender";
import { Request, Response, NextFunction } from "express";
import { User, Lecture } from "../../entities";
import { HTTP400Error } from "./../../utils/httpErrors";

export const findUserAlarm = async (
  { params: { id } }: Request,
  res: Response
): Promise<void> => {
  const user = await User.findOne({ where: { id }, relations: ["lectures"] });
  console.log(user);

  if (!user || !user.check) {
    res.send({
      error: true,
      message: "존재하지 않는 유저입니다. 전화번호 인증으로 가입하세요.",
      needAuth: true
    });
    return;
  }

  res.send({ message: "알람을 가져왔습니다.", lectures: user.lectures });
};

export const addUserAlarm = async (
  { body: { userId, lectureId } }: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const lecture = await Lecture.findOne(lectureId);

  if (!lecture) return next(new HTTP400Error("존재하지 않는 강의입니다."));

  let user = await User.findOne(userId, { relations: ["lectures"] });

  if (!user) {
    res.send({
      error: true,
      needAuth: true,
      message: "존재하지 않는 유저입니다."
    });
    return;
  }

  const duplicatedLecture = user.lectures.find(({ id }) => id === lectureId);
  if (!duplicatedLecture) user.lectures.push(lecture);
  user = await user.save();
  res.send({ lectures: user.lectures });
};

export const deleteUserAlarm = async (
  { params: { userId, lectureId } }: Request,
  res: Response
): Promise<void> => {
  let user = await User.findOne(userId, { relations: ["lectures"] });
  if (!user) {
    res.send({
      error: true,
      needAuth: true,
      message: "존재하지 않는 유저입니다."
    });
    return;
  }

  user.lectures = user.lectures.filter(lecture => lecture.id !== lectureId);
  user = await user.save();

  res.send({ lectures: user.lectures });
};

export const generateAuthCode = async (
  { params: { id } }: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let user = await User.findOne({ where: { id } });

    if (user && user.check) {
      res.send({ error: true, message: "이미 인증한 유저입니다." });
      return;
    }
    console.log(id);

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(code);

    const redisRes = await SETEX(id, 300, code);
    console.log(redisRes);
    console.log(await getAsync(id));

    await sendSMS([id], `[수강신청 알람] 인증번호 [${code}]를 입력해주세요.`);
    console.log("문자 보냄");

    res.send({ message: "인증 문자를 보냈습니다." });
  } catch (e) {
    console.log(e);

    logger.error(e.toString());

    res.send({ error: true, message: "서버 에러가 발생했습니다." });
  }
};

export const checkAuthCode = async (
  { params: { id, code } }: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authCode = await getAsync(id);

  console.log(authCode);

  console.log("test get", await getAsync("test"));

  if (code === authCode) {
    let user = await User.findOne({ id });
    if (user) {
      user.check = true;
      await user.save();
    } else {
      user = await User.create({ id, check: true, lectures: [] }).save();
    }
    console.log(user);
    res.send({ message: "전화번호가 인증됐습니다." });
  } else {
    res.send({ error: true, message: "인증코드가 틀렸습니다." });
  }
};
