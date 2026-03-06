const { producer } = require("./config/kafka");
const startPriorityConsumer = require("./consumers/priorityConsumer");
const startRetryConsumer = require("./consumers/retryConsumer");
const logger = require("./utils/logger");

async function startApp() {
  try {
    await producer.connect();

    await startPriorityConsumer();

    setTimeout(() => {
      startRetryConsumer();
    }, 30000);

    logger.info("Notification consumer started");
  } catch (error) {
    logger.error("Application failed to start", error);
  }
}

startApp();
