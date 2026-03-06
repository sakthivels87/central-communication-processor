const startPriorityConsumer = require("./consumers/priorityConsumer");
const startRetryConsumer = require("./consumers/retryConsumer");

async function startApp() {
  await startPriorityConsumer();

  await startRetryConsumer();
}

startApp();
