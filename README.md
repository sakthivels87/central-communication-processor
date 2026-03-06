# Central Communication Processor

This is a Node.js application that consumes notification messages from Kafka priority topics and processes them based on priority order.

The processor ensures that **high priority messages are always processed first**, followed by **medium**, and then **low priority** messages.

---

# Features

- Consumes messages from Kafka topics
- Supports priority-based message processing
- Stores message status in MongoDB
- Routes messages to channel-specific Kafka topics
- Logs all activities using Winston
- Handles failures using a retry Dead Letter Queue (DLQ)

---

# Priority Processing Order

The processor always reads messages in the following order:

1. `priority-high`
2. `priority-medium`
3. `priority-low`

If messages exist in the `priority-high` topic, they will always be processed first.

If no messages exist in `priority-high`, the processor will check `priority-medium`.

If no messages exist in `priority-medium`, it will then process messages from `priority-low`.

---

# Supported Channels

Each message contains a field called `channel`.

Based on the channel value, the message will be routed to the corresponding Kafka topic.

Supported channels:

| Channel Value | Kafka Topic |
|---------------|-------------|
| email | email |
| sms | sms |
| print | print |
| archive | archive |

---

# Failure Handling

If message processing fails:

1. The message is sent to the `retry-dlq` topic.
2. The retry consumer reads messages from `retry-dlq`.
3. The processor attempts to process the message again after a delay.

---

# Message Status Tracking

Before processing a message, the processor stores it in MongoDB.

Database Collection: notification-interactions

Message Status:

| Status | Description |
|------|-------------|
| IN_PROGRESS | Message processing started |

Example status messages:

MongoDB acts as the **single source of truth** for message processing.

---

# Example Kafka Message

Example message received from priority topics:

```json
{
  "messageId": "12345",
  "customerId": "CUST1001",
  "channel": "email",
  "to": "user@example.com",
  "subject": "Welcome",
  "body": "Welcome to our service"
}
