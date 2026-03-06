const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "notification-priority-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "priority-consumer-group" });
const producer = kafka.producer();

module.exports = { kafka, consumer, producer };
