import axiosInstance from './axiosInstance.js';

/**
 * Fetch all projects for the authenticated user.
 * @param {{ search?: string, status?: string }} params
 * @returns {Promise<Project[]>}
 */
export const getProjects = async (params = {}) => {
  const res = await axiosInstance.get('/projects', { params });
  return res.data.data.projects;
};

/**
 * Fetch a single project by ID.
 * @param {number} id
 * @returns {Promise<Project>}
 */
export const getProjectById = async (id) => {
  const res = await axiosInstance.get(`/projects/${id}`);
  return res.data.data.project;
};

/**
 * Create a new project.
 * @param {{ name, description, status, startDate, endDate }} data
 * @returns {Promise<Project>}
 */
export const createProject = async (data) => {
  const res = await axiosInstance.post('/projects', data);
  return res.data.data.project;
};

/**
 * Update an existing project.
 * @param {number} id
 * @param {{ name?, description?, status?, startDate?, endDate? }} data
 * @returns {Promise<Project>}
 */
export const updateProject = async (id, data) => {
  const res = await axiosInstance.put(`/projects/${id}`, data);
  return res.data.data.project;
};

/**
 * Delete a project by ID.
 * @param {number} id
 */
export const deleteProject = async (id) => {
  await axiosInstance.delete(`/projects/${id}`);
};
