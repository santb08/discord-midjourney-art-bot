const { v1: uuid } = require('uuid');
const { botSelectedImage, botFullFlow, botSelectImage, botDownloadImage } = require('../bot');
const { getTask, createTask, deleteTask, getPendingImages, updateCommand, getPendingUpscales, updateTask } = require('../core/tasks');
const { TASK_TYPES } = require('../utils/constants');
const { getRows } = require('../utils/process_google');

const createTasksController = async (req, res) => {
  try {
    const {
      link_id,
      link_id_auto,
      type
    } = req.body;

    const link = link_id || link_id_auto;
    console.log('[Google Sheet Link]', link);
    const docRows = await getRows(link);
    const new_task = {
      id: uuid(),
      type,
      commands: [],
    };

    docRows.forEach((element, i) => {
      new_task.commands[i] = {
        command: element.command,
        id: element.id,
      }
      // new_task.prefixes[i] = element.id
      // new_task.suffixes[i] = element.tag
    });

    createTask(new_task);
    res.redirect('/');
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: 'Something happened, please try again'
    });
  }
};

const selectImageController = async (req, res) => {
  try {
    const { id: commandId, image: selectedImage } = req.query;
    const pendingImages = await getPendingImages();
    const imageData = pendingImages.find(pendingImage => pendingImage.commandId === commandId);
    console.log('[Selecting Image]', commandId);
    console.log('[Pending Image]', imageData)

    if (!imageData) {
      throw new Error('No data for image');
    }

    const pendingUpscaleData = await botSelectImage(imageData.messageId, selectedImage);
    console.log('[Pending Upscale Data]', pendingUpscaleData);
    await updateCommand(imageData.taskId, imageData.commandId, {
      pendingImage: null,
      pendingUpscale: pendingUpscaleData
    });

    res.redirect("/task/images/review");
  } catch (error) {
    res.render("error", { error });
    res.status(500).send({
      message: 'Something happened'
    });
  }
};

const runTask = async (req, res) => {
  try {
    const { id } = req.query;
    console.log('[Searching Task]', id);
    const task = await getTask(id);

    switch (task.type) {
      case TASK_TYPES.RANDOM_UPSCALED:
        await botFullFlow(task, "random", res);
        break;
      case TASK_TYPES.THIRD_IMAGE:
        await botFullFlow(task, "third", res);
        break;
      case TASK_TYPES.RANDOM_UPSCALED_MAX:
        await botFullFlow(task, "random_max", res);
        break;
      case TASK_TYPES.SELECTED_IMAGE:
        await botSelectedImage(task, res);
        break;
      default:
        throw new Error('No valid type');
    }

    res.render("success");
  } catch (error) {
    res.render("error", { error });
  }
}

const upscaleImageController = async (req, res) => {
  try {
    const images = await getPendingUpscales()

    for (image of images) {
      console.log('[Upscaling Image]', image);
      await botDownloadImage(image, res);
    }

    res.render("success");
  } catch (error) {
    res.render("error", { error });
  }
};

const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedTask = await deleteTask(id);
    console.log('[Deleted]', deletedTask);
    res.redirect("/");
  } catch (error) {
    res.render("error", { error });
  }
}

const editTaskController = async (req, res) => {
  try {
    const { id, type } = req.body;
    console.log('[Updating Task]', id, type);

    await updateTask(id, { type });
    res.redirect("/");
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Something happened, please try again');
  }
}

module.exports = {
  createTasksController,
  selectImageController,
  runTask,
  deleteTaskController,
  upscaleImageController,
  editTaskController,
}