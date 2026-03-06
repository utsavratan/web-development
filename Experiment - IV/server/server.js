const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const cron = require("node-cron");
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });

const SibApiV3Sdk = require("sib-api-v3-sdk");
const reminderTemplate = require("./reminderTemplate");
const completionTemplate = require("./completionTemplate");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

/* ------------------ ENSURE DB EXISTS ------------------ */
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], tasks: [] }, null, 2));
}

/* ------------------ DB HELPERS ------------------ */
function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

/* ------------------ ROOT ROUTE (Health Check) ------------------ */
app.get("/", (req, res) => {
  res.send("THRYLOS Backend is Running ✅");
});

/* ------------------ TEST ROUTE ------------------ */
app.get("/test", (req, res) => {
  res.json({ status: "API OK" });
});

/* ------------------ BREVO SETUP ------------------ */
let emailApi = null;

if (process.env.BREVO_API_KEY) {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;
    emailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    console.log("✅ Brevo email service initialized");
  } catch (err) {
    console.warn("⚠️ Brevo initialization failed:", err.message);
  }
} else {
  console.warn("⚠️ BREVO_API_KEY not set, email features disabled");
}

async function sendMail(to, subject, html) {
  if (!emailApi || !process.env.BREVO_API_KEY || !process.env.SENDER_EMAIL) {
    console.warn("📧 Email disabled - simulating send to:", to);
    return;
  }

  try {
    await emailApi.sendTransacEmail({
      sender: { email: process.env.SENDER_EMAIL, name: "THRYLOS" },
      to: [{ email: to }],
      subject,
      htmlContent: html
    });
    console.log("📧 Email sent to", to);
  } catch (err) {
    console.error("Email error:", err.message);
  }
}

/* ------------------ SIGNUP ------------------ */
app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const exists = db.users.find(u => u.email === email);
  if (exists) return res.status(409).send("User already exists");

  const newUser = { id: uuidv4(), email, password };
  db.users.push(newUser);
  writeDB(db);

  console.log("User Created:", email);
  res.json(newUser);
});

/* ------------------ LOGIN ------------------ */
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    console.log("Login Failed:", email);
    return res.status(401).send("Invalid credentials");
  }

  console.log("Login Success:", email);
  res.json(user);
});

/* ------------------ ADD TASK ------------------ */
app.post("/task", (req, res) => {
  const { title, datetime, email, username } = req.body;

  const db = readDB();

  const task = {
    id: uuidv4(),
    title,
    datetime,
    email,
    username: username || email,
    reminderSent: false,
    completed: false
  };

  db.tasks.push(task);
  writeDB(db);

  console.log("Task Added:", title);
  res.json(task);
});

/* ------------------ COMPLETE TASK ------------------ */
app.post("/complete/:id", async (req, res) => {
  const db = readDB();
  const task = db.tasks.find(t => t.id === req.params.id);

  if (!task) return res.status(404).send("Task not found");

  task.completed = true;
  writeDB(db);

  const html = completionTemplate({
    username: task.username,
    taskTitle: task.title
  });

  await sendMail(task.email, "Task Completed ✅", html);

  res.json(task);
});

/* ------------------ REMINDER CRON (Runs Every Minute) ------------------ */
cron.schedule("* * * * *", async () => {
  const db = readDB();
  const now = new Date();

  db.tasks.forEach(async task => {
    if (task.completed) return;
    const taskTime = new Date(task.datetime);
    const diff = (taskTime - now) / 60000; // minutes until task

    // send a single reminder when task is ~10 minutes away
    if (!task.reminderSent && diff <= 10 && diff > 0) {
      console.log("Sending reminder for:", task.title);

      const html = reminderTemplate({
        taskTitle: task.title,
        taskTime: taskTime.toLocaleString()
      });

      await sendMail(task.email, "Task Reminder ⏰", html);
      task.reminderSent = true;
      writeDB(db);
    }
  });
});

/* ------------------ GET TASKS FOR USER ------------------ */
app.get('/tasks', (req, res) => {
  const email = req.query.email;
  const db = readDB();

  if (!email) return res.status(400).send('Missing email');

  const tasks = db.tasks.filter(t => t.email === email);
  res.json(tasks);
});

/* ------------------ UPDATE TASK ------------------ */
app.patch('/task/:id', (req, res) => {
  const db = readDB();
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).send('Task not found');

  const { title, datetime } = req.body;
  let changed = false;

  if (title !== undefined) {
    task.title = title;
    changed = true;
  }

  if (datetime) {
    const old = task.datetime;
    task.datetime = datetime;
    // if datetime changed, reset reminder flag so user can get a new reminder
    if (old !== datetime) task.reminderSent = false;
    changed = true;
  }

  if (changed) writeDB(db);
  res.json(task);
});

/* ------------------ DELETE TASK ------------------ */
app.delete('/task/:id', (req, res) => {
  const db = readDB();
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).send('Task not found');

  const removed = db.tasks.splice(idx, 1)[0];
  writeDB(db);
  res.json({ deleted: removed.id });
});

/* ------------------ START SERVER ------------------ */
const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});