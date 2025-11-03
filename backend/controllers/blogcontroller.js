import { blogs } from "../data/blogs.js";

export const getPosts = (req, res) => res.json(blogs);

export const createPost = (req, res) => {
  const { title, body } = req.body;
  const newPost = {
    id: Date.now().toString(),
    title,
    body,
    author: req.user.user_id
  };
  blogs.push(newPost);
  res.json(newPost);
};

export const editPost = (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const post = blogs.find(p => p.id === id && p.author === req.user.user_id);
  if (!post) return res.status(403).json({ message: "Not authorized" });

  post.title = title;
  post.body = body;
  res.json(post);
};

export const deletePost = (req, res) => {
  const { id } = req.params;
  const index = blogs.findIndex(p => p.id === id && p.author === req.user.user_id);
  if (index === -1) return res.status(403).json({ message: "NOt authorized" });

  blogs.splice(index, 1);
  res.json({ message: "Deleted successfully!" });
};
