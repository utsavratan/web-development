const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 4000;
const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);
const frontendPath = path.join(__dirname, '..', 'frontend');

const priorityRank = {
  High: 1,
  Medium: 2,
  Low: 3,
};

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority TEXT DEFAULT 'Medium',
      isDone INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function normalizeTask(row) {
  return {
    ...row,
    isDone: Boolean(row.isDone),
  };
}

function validateTitle(title) {
  return typeof title === 'string' && title.trim().length > 0 && title.trim().length <= 50;
}

function validatePriority(priority) {
  return ['Low', 'Medium', 'High'].includes(priority);
}

app.get('/tasks', (req, res) => {
  const { search = '', sort = 'createdAt', order = 'desc' } = req.query;
  const normalizedOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const normalizedSort = ['createdAt', 'priority', 'title'].includes(sort) ? sort : 'createdAt';
  const searchValue = `%${String(search).trim()}%`;

  db.all(
    `SELECT id, title, description, priority, isDone, createdAt
     FROM tasks
     WHERE title LIKE ? OR description LIKE ?`,
    [searchValue, searchValue],
    (error, rows) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to fetch tasks.' });
      }

      let tasks = rows.map(normalizeTask);

      tasks.sort((left, right) => {
        if (normalizedSort === 'priority') {
          const result = priorityRank[left.priority] - priorityRank[right.priority];
          return normalizedOrder === 'ASC' ? result : -result;
        }

        if (normalizedSort === 'title') {
          const result = left.title.localeCompare(right.title);
          return normalizedOrder === 'ASC' ? result : -result;
        }

        const result = new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
        return normalizedOrder === 'ASC' ? result : -result;
      });

      res.json(tasks);
    }
  );
});

app.post('/tasks', (req, res) => {
  const { title, description = '', priority = 'Medium' } = req.body;

  if (!validateTitle(title)) {
    return res.status(400).json({ message: 'Title is required and must be at most 50 characters.' });
  }

  if (!validatePriority(priority)) {
    return res.status(400).json({ message: 'Priority must be Low, Medium, or High.' });
  }

  const statement = `
    INSERT INTO tasks (title, description, priority)
    VALUES (?, ?, ?)
  `;

  db.run(statement, [title.trim(), String(description).trim(), priority], function onInsert(error) {
    if (error) {
      return res.status(500).json({ message: 'Failed to create task.' });
    }

    db.get(
      'SELECT id, title, description, priority, isDone, createdAt FROM tasks WHERE id = ?',
      [this.lastID],
      (fetchError, row) => {
        if (fetchError) {
          return res.status(500).json({ message: 'Task created, but failed to fetch it.' });
        }

        res.status(201).json(normalizeTask(row));
      }
    );
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description = '', priority = 'Medium' } = req.body;

  if (!validateTitle(title)) {
    return res.status(400).json({ message: 'Title is required and must be at most 50 characters.' });
  }

  if (!validatePriority(priority)) {
    return res.status(400).json({ message: 'Priority must be Low, Medium, or High.' });
  }

  db.run(
    `UPDATE tasks
     SET title = ?, description = ?, priority = ?
     WHERE id = ?`,
    [title.trim(), String(description).trim(), priority, id],
    function onUpdate(error) {
      if (error) {
        return res.status(500).json({ message: 'Failed to update task.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      db.get(
        'SELECT id, title, description, priority, isDone, createdAt FROM tasks WHERE id = ?',
        [id],
        (fetchError, row) => {
          if (fetchError) {
            return res.status(500).json({ message: 'Task updated, but failed to fetch it.' });
          }

          res.json(normalizeTask(row));
        }
      );
    }
  );
});

app.patch('/tasks/:id/status', (req, res) => {
  const { id } = req.params;
  const { isDone } = req.body;

  if (typeof isDone !== 'boolean') {
    return res.status(400).json({ message: 'isDone must be a boolean value.' });
  }

  db.run(
    'UPDATE tasks SET isDone = ? WHERE id = ?',
    [isDone ? 1 : 0, id],
    function onToggle(error) {
      if (error) {
        return res.status(500).json({ message: 'Failed to update task status.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      db.get(
        'SELECT id, title, description, priority, isDone, createdAt FROM tasks WHERE id = ?',
        [id],
        (fetchError, row) => {
          if (fetchError) {
            return res.status(500).json({ message: 'Status updated, but failed to fetch task.' });
          }

          res.json(normalizeTask(row));
        }
      );
    }
  );
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function onDelete(error) {
    if (error) {
      return res.status(500).json({ message: 'Failed to delete task.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(204).send();
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dynamic To-Do List server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close(() => {
    process.exit(0);
  });
});