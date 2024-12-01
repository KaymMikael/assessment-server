import { request, response } from "express";
import pool from "../../mysql/sql.js";
import jwt from "jsonwebtoken";

const login = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ error: "Please input all fields" });
      return;
    }

    const query = "SELECT * FROM users WHERE user_email = ?";
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const user = rows[0];
    const isPasswordValid = user.user_password === password;

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    //Generate jwt token
    const token = jwt.sign(user, "my-jwt-key", {
      expiresIn: "1d",
    });

    //add token to cookies
    res.cookie("token", token, { httpOnly: true, secure: true });

    res.status(200).json({ message: "Login successful" });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Check if the current user have an active cookie
const verifyUser = (req = request, res = response, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    //verify and get the decoded token
    const decoded = jwt.verify(token, "my-jwt-key");
    //Set the decoded user
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};

//if the user is authenticated, return the user data
const authenticateUser = (req = request, res = response) => {
  return res.status(200).json(req.user);
};

const logout = (req = request, res = response) => {
  res.clearCookie("token");
  res.status(204).json({ message: "Logged out" });
  return;
};

const UserController = {
  login,
  verifyUser,
  authenticateUser,
  logout,
};

export default UserController;
