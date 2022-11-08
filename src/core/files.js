const fs = require('fs');
const tasks = JSON.parse(fs.readFileSync('tasks.json'));
// const pendingImages = JSON.parse(fs.readFileSync('pending_images.json'));
const pendingUpscales = JSON.parse(fs.readFileSync('pending_upscales.json'));

// console.log('[Tasks]', tasks);
const createTask = (task) => {
  tasks.unshift(task);
  fs.writeFile("tasks.json", JSON.stringify(tasks), (err) => {
    if (err) console.error(err.message);
  });
};

const addPendingImage = (image) => {
  pendingImages.unshift(image);

  fs.writeFile("pending_images.json", JSON.stringify(pendingImages), (err) => {
    if (err) console.error(err.message);
  });
};

module.exports = {
  tasks,
  // pendingImages,
  pendingUpscales,
  createTask,
  addPendingImage,
  // addPendingUpscale,
};