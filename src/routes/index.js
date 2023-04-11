const express = require('express');
const router = express.Router();

router.get('/', (_, res) => {
  try {
    res.status(200).send('MidJourney API');
  } catch (error) {
    res.render('error', { error });
  }
});

module.exports = router;
