const { consumer } = require("../config/kafka");
const processMessage = require("../services/notificationService");
const logger = require("../utils/logger");

const topics = ["priority-high", "priority-medium", "priority-low"];

async function startPriorityConsumer() {
  await consumer.connect();

  for (const topic of topics) {
    await consumer.subscribe({ topic });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const payload = JSON.parse(message.value.toString());

        logger.info(`Received message from ${topic}`);

        await processMessage(payload);
      } catch (err) {
        logger.error("Processing failed sending to retry-dlq");

        const { producer } = require("../config/kafka");

        await producer.send({
          topic: "retry-dlq",
          messages: [{ value: message.value.toString() }],
        });
      }
    },
  });
}

module.exports = startPriorityConsumer;
