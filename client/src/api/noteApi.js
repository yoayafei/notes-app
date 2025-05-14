import axiosInstance from './axiosInstance';

// 创建笔记
export const createNote = async (noteData) => {
  return axiosInstance.post('/notes', noteData);
};

// 查询某个用户的所有笔记，支持分页
export const getNotes = async (userId, page = 1, pageSize = 10) => {
  return axiosInstance.get(`/notes/user/${userId}`, {
    params: { page, pageSize },
  });
};

// 根据标签、分类或标题搜索笔记
export const searchNotesByTags = async (userId, searchText) => {
  return axiosInstance.get(`/notes/search/${userId}`, {
    params: { searchText },
  });
};

// 查询笔记详情
export const getNote = async (noteId) => {
  return axiosInstance.get(`/notes/${noteId}`);
};

// 查询某个用户某类的所有笔记，支持分页
export const getNotesByCategory = async (
  userId,
  categoryId,
  page = 1,
  pageSize = 10,
) => {
  return axiosInstance.get(`/notes/categories/${userId}/${categoryId}`, {
    params: { page, pageSize },
  });
};

// 更新笔记
export const updateNote = async (noteId, noteData) => {
  return axiosInstance.put(`/notes/${noteId}`, noteData);
};

// 更新笔记重要性状态
export const toggleImportant = async (noteId, isImportant) => {
  return axiosInstance.put(`/notes/${noteId}/important`, { isImportant });
};

// 删除笔记
export const moveToTrash = async (noteId) => {
  return axiosInstance.put(`/notes/${noteId}/trash`);
};

// Get all notes in trash
// 获取回收站中的笔记，支持分页
export const getTrashNotes = async (userId, page = 1, pageSize = 10) => {
  return await axiosInstance.get(`/notes/trash/${userId}`, {
    params: { page, pageSize },
  });
};

// 从回收站恢复笔记
export const restoreNote = async (noteId) => {
  return await axiosInstance.put(`/notes/${noteId}/restore`);
};

// 永久删除笔记（仅限回收站中的笔记）
export const deleteNotePermanently = async (noteId) => {
  return await axiosInstance.delete(`/notes/${noteId}`);
};

// 获取用户的重要笔记
export const getImportantNotes = async (userId) => {
  return axiosInstance.get(`/notes/important/${userId}`);
};

export default {
  createNote,
  getNotes,
  getNote,
  updateNote,
  moveToTrash,
  getTrashNotes,
  restoreNote,
  deleteNotePermanently,
  getNotesByCategory,
  searchNotesByTags,
  toggleImportant,
  getImportantNotes,
};
