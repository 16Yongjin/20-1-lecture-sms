import {
  findLectures,
  storeLectures,
  searchLectures
} from "./LectureController";
import { checkLectureSearchParams } from "./../../middleware/checks";

export default [
  {
    path: "/lectures/search",
    method: "get",
    handler: [checkLectureSearchParams, searchLectures]
  },
  {
    path: "/lectures/:courseId",
    method: "get",
    handler: findLectures
  },
  {
    path: "/storeLectures",
    method: "get",
    handler: storeLectures
  }
];
