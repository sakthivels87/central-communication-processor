const connectDB = require("../config/mongo");
const sendToChannel = require("../producers/channelProducer");
const logger = require("../utils/logger");

async function processMessage(message) {
  const collection = await connectDB();
  try {
    await collection.updateOne(
      { trackingId: message.trackingId },
      {
        $set: {
          channel: message.channel,
          status: "IN_PROGRESS",
          statusMessage: `Request delivered to ${message.channel} processor`,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
    await sendToChannel(message.channel, message);
  } catch (error) {
    message.statusMessage = "Request failed in processing will retry shortly.";

    await collection.insertOne(message);

    logger.error("Processing failed", error);

    throw error;
  }
}

module.exports = processMessage;
