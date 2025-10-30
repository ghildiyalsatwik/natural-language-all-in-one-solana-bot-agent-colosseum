import { checkBinsAndNotify } from "./services/binTracker.js";

setInterval(checkBinsAndNotify, 5 * 1000);