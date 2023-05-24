import { IncomingMessage } from "http";

export function isAuthenticated(req: IncomingMessage) {
  return true;
}
