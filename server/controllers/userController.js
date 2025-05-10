import pool from "../config/db.js";

// 注册用户
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, nickname, avatar_url } = req.body;
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );
    res.status(201).json({ id: result.insertId, username, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 登录用户
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 获取用户信息
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, avatar, mobile } = req.body;

    // 验证文件大小（最大1MB）
    if (avatar && avatar.size > 10 * 1024 * 1024) {
      return res.status(413).json({ error: "文件大小超过10MB限制" });
    }

    await pool.query(
      "UPDATE users SET nickname = ?, avatar_url = ?, mobile = ? WHERE id = ?",
      [nickname, avatar ? avatar.url : null, mobile, id]
    );
    res.status(200).json({ message: "用户信息更新成功" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
