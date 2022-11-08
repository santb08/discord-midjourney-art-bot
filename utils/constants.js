
const TASK_STATUS = {
  READY_TO_RUN: 'READY_TO_RUN',
  IMAGE_REVIEW: 'IMAGE_REVIEW',
  UPSCALE_PENDING: 'UPSCALE_PENDING',
  DONE: 'DONE'
}

const TASK_TYPES = {
  RANDOM_UPSCALED: 'Random Upscaled image',
  THIRD_IMAGE: 'The third image',
  RANDOM_UPSCALED_MAX: 'Random Max Upscaled image',
  SELECTED_IMAGE: 'Selected image'
}

module.exports = {
  TASK_STATUS,
  TASK_TYPES
}