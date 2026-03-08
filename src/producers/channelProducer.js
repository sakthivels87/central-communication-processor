const { producer } = require("../config/kafka");
const logger = require("../utils/logger");

async function sendToChannel(channel, message) {
  try {
    await producer.connect();
    await producer.send({
      topic: channel,
      messages: [
        {
          key: message.customerId || "default",
          value: JSON.stringify(message),
        },
      ],
    });

    logger.info(`Message routed to ${channel} topic`);
  } catch (err) {
    logger.error("Failed sending message to channel", err);
    throw err;
  }
}

module.exports = sendToChannel;
