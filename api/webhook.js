require("dotenv").config();
const { handleEvent } = require('./handlers/events');

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  const ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

  try {
    const bodyText = await buffer(req);
    const body = JSON.parse(bodyText);

    console.log("🚨 受信データ:", JSON.stringify(body, null, 2));

    const events = body.events;
    if (!events) {
      res.status(200).send('No events');
      return;
    }

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      await handleEvent(event, ACCESS_TOKEN);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(500).send('Error');
  }
};
