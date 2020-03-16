import {
  checkAddUserAlarmBody,
  checkDeleteUserAlarmBody,
  checkId
} from "./../../middleware/checks";
import {
  findUserAlarm,
  addUserAlarm,
  deleteUserAlarm,
  generateAuthCode,
  checkAuthCode
} from "./UserController";

export default [
  {
    path: "/users/:id",
    method: "get",
    handler: findUserAlarm
  },
  {
    path: "/users",
    method: "post",
    handler: [checkAddUserAlarmBody, addUserAlarm]
  },
  {
    path: "/users/:userId/:lectureId",
    method: "delete",
    handler: [checkDeleteUserAlarmBody, deleteUserAlarm]
  },
  {
    path: "/getAuthCode/:id",
    method: "get",
    handler: [checkId, generateAuthCode]
  },
  {
    path: "/checkAuthCode/:id/:code",
    method: "get",
    handler: [checkId, checkAuthCode]
  }
];
