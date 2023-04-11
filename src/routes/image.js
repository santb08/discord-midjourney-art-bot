const bot = require('../core/bot');

const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const { query } = req.query;

    console.log('[Query]', query);

    await bot.sendMessage('Hi');
    res.status(200).send('Ok');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something happened');
  }
});

module.exports = router;