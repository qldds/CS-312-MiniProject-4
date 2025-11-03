import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../data/blogs.js";

export const signup = (req, res) => {
  const { user_id, password, name } = req.body;
  const existing = users.find(u => u.user_id === user_id);
  if (existing) return res.status(400).json({ message: "User already exists!" });

  const hashed = bcrypt.hashSync(password, 8);
  users.push({ user_id, password: hashed, name });
  res.json({ message: "Signup successful!" });
};

export const signin = (req, res) => {
  const { user_id, password } = req.body;
  const user = users.find(u => u.user_id === user_id);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ message: "Invalid username or password" });

  const token = jwt.sign({ user_id }, "secret", { expiresIn: "2h" });
  res.json({ token, user_id });
};
