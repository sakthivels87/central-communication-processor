const { retryConsumer } = require("../config/kafka");
const processMessage = require("../services/communicationProcessor");

async function startRetryConsumer() {
  await retryConsumer.connect();

  await retryConsumer.subscribe({ topic: "retry-dlq", fromBeginning: true });

  await retryConsumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());

      await processMessage(payload);
    },
  });
}

module.exports = startRetryConsumer;
