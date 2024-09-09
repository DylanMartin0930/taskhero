import express from "express";
import { getTasks, getTask, createTask } from "./database.js";

const app = express();

app.get("/tasks", async (req, res) => {
  const tasks = await getTasks();
  res.send(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const task = await getTask(id);
  res.send(task);
});

app.post("/tasks", async (req, res) => {
  const { title, contents } = req.body;
  const note = await createTask(title, contents);
  res.status(201).send(note);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
