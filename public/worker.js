// worker.ts
import { WebWorkerMLCEngineHandler } from "/web-llm.js";

// A handler that resides in the worker thread
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg) => {
  handler.onmessage(msg);
};
