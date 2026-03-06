const { Kafka } = require("kafkajs");
const logger = require("../utils/logger");
const processMessage = require("../services/communicationProcessor");

const kafka = new Kafka({
  clientId: "priority-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "priority-group" });

const highQueue = [];
const mediumQueue = [];
const lowQueue = [];

async function startPriorityConsumer() {
  await consumer.connect();

  await consumer.subscribe({ topic: "priority-high", fromBeginning: true });
  await consumer.subscribe({ topic: "priority-medium", fromBeginning: true });
  await consumer.subscribe({ topic: "priority-low", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = JSON.parse(message.value.toString());
      if (topic === "priority-high") {
        highQueue.push(payload);
      }

      if (topic === "priority-medium") {
        mediumQueue.push(payload);
      }

      if (topic === "priority-low") {
        lowQueue.push(payload);
      }

      processPriorityQueue();
    },
  });
}

async function processPriorityQueue() {
  try {
    if (highQueue.length > 0) {
      const msg = highQueue.shift();
      logger.info("Processing HIGH priority message");

      await processMessage(msg);
      return;
    }

    if (mediumQueue.length > 0) {
      const msg = mediumQueue.shift();
      logger.info("Processing MEDIUM priority message");

      await processMessage(msg);
      return;
    }

    if (lowQueue.length > 0) {
      const msg = lowQueue.shift();
      logger.info("Processing LOW priority message");

      await processMessage(msg);
      return;
    }
  } catch (error) {
    logger.error("Processing failed");
  }
}

module.exports = startPriorityConsumer;
