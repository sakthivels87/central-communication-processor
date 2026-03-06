const { consumer } = require("../config/kafka");
const processMessage = require("../services/notificationService");
const logger = require("../utils/logger");

async function startRetryConsumer() {
  await consumer.connect();

  await consumer.subscribe({ topic: "retry-dlq" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const payload = JSON.parse(message.value.toString());

        logger.info("Retrying message from retry-dlq");

        await processMessage(payload);
      } catch (err) {
        logger.error("Retry failed again");
      }
    },
  });
}

module.exports = startRetryConsumer;
