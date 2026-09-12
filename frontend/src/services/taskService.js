import axiosInstance from './axiosInstance.js';

/**
 * Fetch tasks for the authenticated user.
 * @param {{ projectId?: number, search?: string, status?: string, priority?: string }} params
 * @returns {Promise<Task[]>}
 */
export const getTasks = async (params = {}) => {
  const res = await axiosInstance.get('/tasks', { params });
  return res.data.data.tasks;
};

/**
 * Fetch a single task by ID.
 * @param {number} id
 * @returns {Promise<Task>}
 */
export const getTaskById = async (id) => {
  const res = await axiosInstance.get(`/tasks/${id}`);
  return res.data.data.task;
};

/**
 * Create a new task.
 * @param {{ name, description, priority, status, dueDate, projectId }} data
 * @returns {Promise<Task>}
 */
export const createTask = async (data) => {
  const res = await axiosInstance.post('/tasks', data);
  return res.data.data.task;
};

/**
 * Update a task (full update or mark-as-complete).
 * To mark complete: updateTask(id, { status: 'COMPLETED' })
 * @param {number} id
 * @param {object} data
 * @returns {Promise<Task>}
 */
export const updateTask = async (id, data) => {
  const res = await axiosInstance.put(`/tasks/${id}`, data);
  return res.data.data.task;
};

/**
 * Delete a task by ID.
 * @param {number} id
 */
export const deleteTask = async (id) => {
  await axiosInstance.delete(`/tasks/${id}`);
};
