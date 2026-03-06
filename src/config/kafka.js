const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "notification-processor",
  brokers: ["localhost:9092"],
});

const priorityConsumer = kafka.consumer({
  groupId: "priority-consumer-group",
});

const retryConsumer = kafka.consumer({
  groupId: "retry-consumer-group",
});

const producer = kafka.producer();

module.exports = {
  kafka,
  producer,
  priorityConsumer,
  retryConsumer,
};
