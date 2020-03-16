import { flatten } from "lodash";
import lectureRoutes from "./lecture/routes";
import userRoutes from "./user/routes";
import alarmRoutes from "./alarm/routes";
import adminRoutes from "./admin/routes";

export default flatten([lectureRoutes, userRoutes, alarmRoutes, adminRoutes]);
