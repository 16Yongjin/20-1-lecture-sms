import { Request, Response } from "express";
import { CronJob } from "cron";
import { User, Lecture } from "../../entities";
import { checkLectures } from "../alarm/AlarmController";
import { readFile as readFileCb } from "fs";
import { promisify } from "util";
import { Server, Socket } from "socket.io";
import { logger, alarmLogger } from "../../utils/logger";

const readFile = promisify(readFileCb);

// '*/3 * 10-16 * * *'
export const alarmJob = new CronJob({
  cronTime: "*/2 * 10-16 * * *",
  onTick: () => {
    console.log("alarm start");
    checkLectures();
  },
  timeZone: "Asia/Seoul"
});

export const startCron = async (req: Request, res: Response): Promise<void> => {
  alarmJob.start();
  res.send("cron on");
};

export const stopCron = async (req: Request, res: Response): Promise<void> => {
  alarmJob.stop();
  res.send("cron off");
};

export const findUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ relations: ["lectures"] });
    res.send(users);
  } catch {
    res.send(500);
  }
};

export const findAlarms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lectures = await Lecture.find({
      relations: ["users"],
      join: { alias: "lectures", innerJoin: { users: "lectures.users" } }
    });
    res.send(lectures);
  } catch {
    res.send(500);
  }
};

export const findLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logFile = await readFile("combined.log");
    res.send(`<pre>${logFile.toString()}</pre>`);
  } catch {
    res.send("error loading log file");
  }
};

export const findErrors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errorFile = await readFile("error.log");
    res.send(`<pre>${errorFile.toString()}</pre>`);
  } catch {
    res.send("error loading error file");
  }
};

export const findCompletedAlarms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const alarmFile = await readFile("alarm.log");
    res.send(`<pre>${alarmFile.toString()}</pre>`);
  } catch {
    res.send("error loading alarm file");
  }
};

export const getDashboardData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({ relations: ["lectures"] });
    const alarms = await Lecture.find({
      relations: ["users"],
      join: { alias: "lectures", innerJoin: { users: "lectures.users" } }
    });
    const completedAlarms = await readFile("alarm.log");

    res.send({
      users,
      alarms,
      completedAlarms: completedAlarms.toString("utf-8")
    });
  } catch {
    res.sendStatus(500);
  }
};

export const sendLogViewer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const logViewer = await readFile("log.html");
    res.send(logViewer.toString());
  } catch {
    res.send("error loading log.html file");
  }
};

export const sendAlarmLogViewer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const alarmLogViewer = await readFile("alarmLog.html");
    res.send(alarmLogViewer.toString());
  } catch {
    res.send("error loading alarmLog.html file");
  }
};

export const logStream = async (io: Server): Promise<void> => {
  io.on("connection", (socket: Socket) => {
    console.log("socket connected!!");

    const logListener = (info: any) => {
      socket.emit("log", JSON.stringify(info));
    };

    const alarmLogListener = (info: any) => {
      socket.emit("alarmLog", JSON.stringify(info));
    };

    const loggerStream = logger.on("data", logListener);
    const alarmLoggerStream = alarmLogger.on("data", alarmLogListener);

    socket.on("disconnect", () => {
      loggerStream.removeListener("data", logListener);
      alarmLoggerStream.removeListener("data", alarmLogListener);
    });
  });
};
