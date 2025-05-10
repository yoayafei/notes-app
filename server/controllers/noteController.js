import pool from "../config/db.js";

// 创建笔记
export const createNote = async (req, res) => {
  try {
    const { userId, title, content, categoryId, tags } = req.body;
    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content, category_id, tags) VALUES (?, ?, ?, ?, ?)",
      [userId, title, content, categoryId, JSON.stringify(tags)]
    );
    res.status(201).json({
      id: result.insertId,
      userId,
      title,
      content,
      categoryId,
      tags,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取笔记列表
export const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND deleted = 0",
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根据分类获取笔记列表
export const getNotesByCategory = async (req, res) => {
  try {
    const { userId, categoryId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND category_id = ? AND deleted = 0",
      [userId, categoryId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根据标签或分类名称搜索笔记
export const searchNotesByTags = async (req, res) => {
  try {
    const { userId } = req.params;
    const { searchText } = req.query;

    let query = `
      SELECT DISTINCT n.* 
      FROM notes n
      LEFT JOIN categories c ON n.category_id = c.id
      WHERE n.user_id = ?
    `;
    const params = [userId];

    if (searchText) {
      query += ` AND (
        JSON_CONTAINS(n.tags, JSON_ARRAY(?), '$')
        OR c.name LIKE ?
        OR n.title LIKE ?
      )`;
      params.push(searchText, `%${searchText}%`, `%${searchText}%`);
    }

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取单个笔记
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新笔记
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId, tags } = req.body;
    await pool.query(
      "UPDATE notes SET title = ?, content = ?, category_id = ?, tags = ? WHERE id = ?",
      [title, content, categoryId, JSON.stringify(tags), id]
    );
    res.status(200).json({ id, title, content, categoryId, tags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 软删除笔记（移动到回收站）
export const moveToTrash = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "UPDATE notes SET deleted = 1 WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json({ message: "Note moved to trash" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取回收站中的笔记
export const getTrashNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND deleted = 1",
      [userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 从回收站恢复笔记
export const restoreNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "UPDATE notes SET deleted = 0 WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json({ message: "Note restored" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 永久删除笔记
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM notes WHERE id = ? AND deleted = 1",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json({ message: "Note permanently deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
