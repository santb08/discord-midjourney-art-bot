const express = require("express");
const { getTask, getPendingImages } = require("../core/tasks");
const router = express.Router();
const {
  createTasksController,
  deleteTaskController,
  editTaskController,
  runTask,
  selectImageController,
  upscaleImageController,
} = require("../controllers/tasks");

router.post("/task/create", createTasksController);
router.get("/task/delete", deleteTaskController);
router.get("/task/open", async (req, res) => {
  try {
    const { id } = req.query;
    const element = await getTask(id)
    res.render("edit", { element, id });
  } catch (error) {
    res.render("error", { error });
  }
});

router.post("/task/edit", editTaskController);
router.get("/task/run", runTask);
router.get("/task/image/upscale", upscaleImageController);

router.get("/task/images/review", async (_, res) => {
  try {
    // fs.readFile("  .json", async (_, data) => {
    const images = await getPendingImages();
    res.render("select_image", { images });
    // });
  } catch (error) {
    res.render("error", { error });
  }
});

router.get("/task/image/select", selectImageController);

module.exports = router;
