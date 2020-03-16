import { sendSMS } from "./../../utils/sendSMS";
import { Request, Response } from "express";
import { chain, map } from "lodash";
import { logger, alarmLogger } from "./../../utils/logger";
import { sendFcm } from "./../../utils/fcmSender";
import { filterLectures } from "./../lecture/providers/LectureProvider";
import { Lecture } from "../../entities";

export const checkLectures = async (): Promise<void> => {
  const lectures = await Lecture.find({
    relations: ["users", "users.lectures"],
    join: { alias: "lectures", innerJoin: { users: "lectures.users" } }
  });

  const grouped = chain(lectures)
    .groupBy("courseId")
    .entries()
    .value();

  grouped.forEach(async ([courseId, lectures]) => {
    const filteredLectures = await filterLectures(courseId, lectures);

    filteredLectures.forEach(({ id, users, name, professor, time }) => {
      alarmLogger.info(`${name} ${professor} ${time} | ${users.length}`);

      sendSMS(map(users, "id"), `${name} / ${professor} / ${time} 자리났어요.`)
        .then(() => users.forEach(user => user.removeLecture(id)))
        .catch(logger.error);
    });
  });
};

export const checkLecturesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.send("ok");

  checkLectures();
};
