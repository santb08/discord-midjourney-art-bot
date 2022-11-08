const express = require('express');
const router = express.Router();
const { getTasks, getPendingUpscales, getPendingImages } = require('../core/tasks');

router.get('/', async (_, res) => {
  try {
    const tasks = await getTasks();
    const pendingImages = await getPendingImages();
    const pendingUpscales = await getPendingUpscales();

    res.render('index', {
      tasks,
      pending_images: pendingImages,
      pending_upscales: pendingUpscales,
    });
  } catch (error) {
    res.render('error', { error });
  }
});

module.exports = router;
