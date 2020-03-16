import {
  handleCors,
  handleBodyRequestParsing,
  handleCompression,
  handleLogging,
  handleMonitor
} from "./common";

import { handleAPIDocs } from "./apiDocs";

export default [
  handleCors,
  handleBodyRequestParsing,
  handleCompression,
  handleLogging,
  handleMonitor,
  handleAPIDocs
];
