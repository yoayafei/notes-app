import pool from "../config/db.js";

// 注册用户
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, nickname, avatar_url } = req.body;
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password]
    );
    res.status(201).json({
      id: result.insertId,
      username,
      email,
    });
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

// 更新用户信息
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, mobile } = req.body;

    // 构建更新查询
    let query = "UPDATE users SET";
    const params = [];

    if (nickname !== undefined) {
      query += " nickname = ?";
      params.push(nickname);
    }

    if (mobile !== undefined) {
      if (params.length > 0) query += ",";
      query += " mobile = ?";
      params.push(mobile);
    }

    query += " WHERE id = ?";
    params.push(id);

    // 执行更新
    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // 获取更新后的用户信息
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
