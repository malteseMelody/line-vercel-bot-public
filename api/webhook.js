
const { handleEvent } = require('./handlers/events');

module.exports = async (req, res) => {
  const ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

  try {
    const events = req.body.events;

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
    console.error('Webhook Error:', error);
    res.status(500).send('Error');
  }
};
