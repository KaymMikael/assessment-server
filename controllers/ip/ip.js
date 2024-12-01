import { request, response } from "express";
import pool from "../../mysql/sql.js";

const addHistory = async (req = request, res = response) => {
  const { user_id, ip } = req.body;
  try {
    if (!user_id || !ip) {
      res.status(400).json({ error: "Please provide user_id and IP address" });
      return;
    }

    const insertQuery = "INSERT INTO ip_history (user_id, ip) VALUES (?, ?)";
    await pool.query(insertQuery, [user_id, ip]);

    const selectQuery = "SELECT * FROM ip_history WHERE user_id = ? AND ip = ?";
    const [rows] = await pool.query(selectQuery, [user_id, ip]);

    res.status(200).json({
      message: "IP address added to history successfully",
      data: rows[0],
    });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      res
        .status(409)
        .json({ error: "IP address already exists for this user" });
    } else {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const getHistoryByUserId = async (req = request, res = response) => {
  const { user_id } = req.params;
  try {
    if (!user_id) {
      res.status(400).json({ error: "Please provide a user_id" });
      return;
    }
    const query = "SELECT * FROM ip_history WHERE user_id = ?";
    const [rows] = await pool.query(query, [user_id]);
    if (rows.length === 0) {
      res.status(404).json({ error: "No history found for this user" });
      return;
    }
    res
      .status(200)
      .json({ message: "History retrieved successfully", history: rows });
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

const IPController = {
  addHistory,
  getHistoryByUserId,
};

export default IPController;
