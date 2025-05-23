import pool from "../config/db.js";

// 创建笔记
export const createNote = async (req, res) => {
  try {
    const { userId, title, content, categoryId, tags } = req.body;
    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content, category_id, tags, deleted) VALUES (?, ?, ?, ?, ?, 0)",
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

// 获取笔记列表（支持分页）
export const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    // 计算偏移量
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // 获取总记录数
    const [countResult] = await pool.query(
      "SELECT COUNT(*) as total FROM notes WHERE user_id = ? AND deleted = 0",
      [userId]
    );
    const total = countResult[0].total;

    // 获取分页数据
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND deleted = 0 LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );

    res.status(200).json({
      notes: rows,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根据分类获取笔记列表（支持分页）
export const getNotesByCategory = async (req, res) => {
  try {
    const { userId, categoryId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    // 计算偏移量
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // 获取总记录数
    const [countResult] = await pool.query(
      "SELECT COUNT(*) as total FROM notes WHERE user_id = ? AND category_id = ? AND deleted = 0",
      [userId, categoryId]
    );
    const total = countResult[0].total;

    // 获取分页数据
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND category_id = ? AND deleted = 0 LIMIT ? OFFSET ?",
      [userId, categoryId, limit, offset]
    );

    res.status(200).json({
      notes: rows,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
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

// 获取回收站中的笔记（支持分页）
export const getTrashNotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    // 计算偏移量
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // 获取总记录数
    const [countResult] = await pool.query(
      "SELECT COUNT(*) as total FROM notes WHERE user_id = ? AND deleted = 1",
      [userId]
    );
    const total = countResult[0].total;

    // 获取分页数据
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND deleted = 1 LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );

    res.status(200).json({
      notes: rows,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
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

// 更新笔记重要性状态
export const toggleImportant = async (req, res) => {
  try {
    const { id } = req.params;
    const { isImportant } = req.body;
    const importantValue = isImportant ? 1 : 0;

    const [result] = await pool.query(
      "UPDATE notes SET important = ? WHERE id = ?",
      [importantValue, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({
      message: isImportant
        ? "Note marked as important"
        : "Note unmarked as important",
      important: importantValue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取用户的重要笔记
export const getImportantNotes = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? AND important = 1 AND deleted = 0",
      [userId]
    );

    res.status(200).json({
      notes: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
