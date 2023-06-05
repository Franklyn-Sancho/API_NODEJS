import { IncomingMessage } from "http";

export async function readRequestBody(req: IncomingMessage): Promise<string> {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  await new Promise((resolve) => {
    req.on("end", resolve);
  });

  return body;
}
