const store = require('node-persist');

// const store = storage.create({dir: 'data', ttl: 3000});
const TASKS_KEY = 'TASKS';

const getTasks = async () => await store.values();

const getTask = async (taskId) => {
  console.log('[Searching Task]', taskId);
  const task = await store.get(taskId);
  console.log('[Found]', task);
  return task;
};

const createTask = async (newTask) => {
  await store.setItem(newTask.id, newTask);
}

const deleteTask = async (taskId) => {
  return await store.removeItem(taskId);
}

const updateTask = async (taskId, data) => {
  const task = await getTask(taskId);

  if (!task) {
    throw new Error('No task found');
  }

  return await store.setItem(taskId, {
    ...task,
    ...data,
  });
}

const getTasksWithPendingImages = async () => {
  const tasks = await getTasks();
  // console.log(tasks[0].commands)
  const tasksWithPendingImages = tasks.filter(
    (task) => task.commands.some(command => command.pendingImage)
  );
  console.log('[Tasks With Pending Images]', tasksWithPendingImages);
  return tasksWithPendingImages;
};

const getPendingImages = async () => {
  const tasks = await getTasks();
  const images = tasks.flatMap(task => task.commands.map(command => ({
    ...command.pendingImage,
    command: command.command,
    commandId: command.id,
    taskId: task.id
  }))).filter(image => image.messageId);
  console.log('[Pending Images]', images);
  return images;
}

const getPendingUpscales = async () => {
  const tasks = await getTasks();
  const images = tasks.flatMap(task => task.commands.map(command => ({
    ...command.pendingUpscale,
    command: command.command,
    commandId: command.id,
    taskId: task.id
  }))).filter(image => image.messageId);

  console.log('[Pending Upscales]', images);
  return images;
}

const updateCommand = async (taskId, commandId, commandData) => {
  const task = await getTask(taskId);

  if (!task) {
    throw new Error('No task found');
  }

  console.log('[Updating]', task, commandId, commandData);
  const commandUpdated = task.commands.find(command => command.id === commandId);
  const commandsFiltered = task.commands.filter(command => command.id !== commandId);
  const command = {
    ...commandUpdated,
    ...commandData
  };

  const newCommands = [
    ...commandsFiltered,
    command
  ];

  await updateTask(taskId, {
    commands: newCommands
  })
}

const init = async () => {
  await store.init({
    dir: 'data'
  });

  // If no tasks, create
  const tasks = await getTasks();

  if (!tasks) {
    console.log('[Creating Tasks]');
    await store.setItem(TASKS_KEY, []);
  }

  console.log('[Tasks]', await getTasks());
};

init();


module.exports = {
  getTasks,
  getTask,
  createTask,
  getTasksWithPendingImages,
  deleteTask,
  updateTask,
  getPendingImages,
  updateCommand,
  getPendingUpscales,
}