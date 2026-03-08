const connectDB = require("../config/mongo");
const sendToChannel = require("../producers/channelProducer");
const logger = require("../utils/logger");

async function processMessage(message) {
  const collection = await connectDB();
  try {
    const payload = {
      ...message,
      status: "IN_PROGRESS",
      statusMessage: `Request delivered to ${message.channel} processor`,
      createdAt: new Date(),
    };
    await collection.insertOne(payload);
    await sendToChannel(message.channel, message);
  } catch (error) {
    message.statusMessage = "Request failed in processing will retry shortly.";

    await collection.insertOne(message);

    logger.error("Processing failed", error);

    throw error;
  }
}

module.exports = processMessage;
