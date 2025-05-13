import pool from "../config/db.js";
import fs from "fs";
import path from "path";

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
    const { nickname, mobile, avatar_url } = req.body;

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

    if (avatar_url !== undefined) {
      if (params.length > 0) query += ",";
      query += " avatar_url = ?";
      params.push(avatar_url);
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

// 上传用户头像
export const uploadUserAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查用户是否存在
    const [userRows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: "用户不存在" });
    }

    // 检查是否有文件上传
    if (!req.file) {
      return res.status(400).json({ error: "没有上传文件" });
    }

    // 获取文件路径
    const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
    const avatarUrl = `${serverUrl}/uploads/avatars/${req.file.filename}`;

    // 更新用户头像URL
    await pool.query("UPDATE users SET avatar_url = ? WHERE id = ?", [
      avatarUrl,
      id,
    ]);

    // 获取更新后的用户信息
    const [updatedUser] = await pool.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);

    res.status(200).json({
      message: "头像上传成功",
      avatar_url: avatarUrl,
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("头像上传错误:", error);
    res.status(500).json({ error: error.message });
  }
};
