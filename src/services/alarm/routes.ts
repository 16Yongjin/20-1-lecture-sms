import { checkLecturesHandler } from "./AlarmController";

export default [
  {
    path: "/checkLectures",
    method: "get",
    handler: checkLecturesHandler
  }
];
