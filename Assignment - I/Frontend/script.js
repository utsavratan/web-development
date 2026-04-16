const API_BASE_URL = 'http://localhost:4000';
const TITLE_LIMIT = 50;

const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskPriority = document.getElementById('taskPriority');
const sortTasks = document.getElementById('sortTasks');
const searchTasks = document.getElementById('searchTasks');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEditButton');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCounter = document.getElementById('taskCounter');
const activeCounter = document.getElementById('activeCounter');
const statusMessage = document.getElementById('statusMessage');
const exportButton = document.getElementById('exportButton');
const taskTemplate = document.getElementById('taskTemplate');
const filterButtons = [...document.querySelectorAll('.filter-btn')];

const state = {
  tasks: [],
  filter: 'all',
  editingTaskId: null,
  searchTerm: '',
  sortValue: 'createdAt-desc',
};

document.addEventListener('DOMContentLoaded', () => {
  attachEventListeners();
  loadTasks();
});

function attachEventListeners() {
  taskForm.addEventListener('submit', handleFormSubmit);
  cancelEditButton.addEventListener('click', resetForm);
  exportButton.addEventListener('click', exportTasks);
  searchTasks.addEventListener('input', handleSearch);
  sortTasks.addEventListener('change', handleSortChange);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      renderTasks();
    });
  });
}

async function loadTasks() {
  try {
    setStatus('Loading tasks...');
    const tasks = await request(`/tasks${buildQueryString()}`);
    state.tasks = tasks;
    renderTasks();
    setStatus('Tasks loaded successfully.');
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const payload = getFormPayload();
  if (!payload) {
    return;
  }

  try {
    if (state.editingTaskId) {
      const updatedTask = await request(`/tasks/${state.editingTaskId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      updateTaskInState(updatedTask);
      setStatus('Task updated successfully.');
    } else {
      const createdTask = await request('/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      state.tasks.unshift(createdTask);
      setStatus('Task added successfully.');
    }

    resetForm();
    await reloadFromServer();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function getFormPayload() {
  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();
  const priority = taskPriority.value;

  if (!title) {
    setStatus('Task title cannot be empty.', true);
    taskTitle.focus();
    return null;
  }

  if (title.length > TITLE_LIMIT) {
    setStatus(`Task title must be ${TITLE_LIMIT} characters or less.`, true);
    taskTitle.focus();
    return null;
  }

  return { title, description, priority };
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = '';

  visibleTasks.forEach((task) => {
    const fragment = taskTemplate.content.cloneNode(true);
    const taskItem = fragment.querySelector('.task-item');
    const checkbox = fragment.querySelector('.task-checkbox');
    const title = fragment.querySelector('.task-title');
    const description = fragment.querySelector('.task-description');
    const date = fragment.querySelector('.task-date');
    const badge = fragment.querySelector('.priority-badge');
    const editButton = fragment.querySelector('.edit-btn');
    const deleteButton = fragment.querySelector('.delete-btn');

    taskItem.dataset.taskId = task.id;
    taskItem.classList.toggle('completed', task.isDone);
    checkbox.checked = task.isDone;
    title.textContent = task.title;
    description.textContent = task.description || 'No description provided.';
    date.textContent = `Created: ${new Date(task.createdAt).toLocaleString()}`;
    badge.textContent = task.priority;
    badge.classList.add(`priority-${task.priority.toLowerCase()}`);

    checkbox.addEventListener('change', () => toggleTaskStatus(task.id, checkbox.checked));
    editButton.addEventListener('click', () => startEdit(task));
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(fragment);
  });

  emptyState.style.display = visibleTasks.length ? 'none' : 'block';
  updateCounters();
}

function getVisibleTasks() {
  const searchTerm = state.searchTerm.toLowerCase();

  return state.tasks.filter((task) => {
    const matchesSearch =
      searchTerm.length === 0 ||
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description || '').toLowerCase().includes(searchTerm);

    if (!matchesSearch) {
      return false;
    }

    if (state.filter === 'active') {
      return !task.isDone;
    }

    if (state.filter === 'completed') {
      return task.isDone;
    }

    return true;
  });
}

function updateCounters() {
  const total = state.tasks.length;
  const completed = state.tasks.filter((task) => task.isDone).length;
  taskCounter.textContent = `${completed} / ${total}`;
  activeCounter.textContent = String(total - completed);
}

function startEdit(task) {
  state.editingTaskId = task.id;
  taskTitle.value = task.title;
  taskDescription.value = task.description || '';
  taskPriority.value = task.priority;
  submitButton.textContent = 'Update Task';
  cancelEditButton.classList.remove('hidden');
  taskTitle.focus();
  setStatus('Editing task. Update the fields and save.');
}

function resetForm() {
  taskForm.reset();
  taskPriority.value = 'Medium';
  state.editingTaskId = null;
  submitButton.textContent = 'Add Task';
  cancelEditButton.classList.add('hidden');
}

async function toggleTaskStatus(taskId, isDone) {
  try {
    const updatedTask = await request(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isDone }),
    });

    updateTaskInState(updatedTask);
    renderTasks();
    setStatus(`Task marked as ${isDone ? 'completed' : 'active'}.`);
  } catch (error) {
    setStatus(error.message, true);
    await reloadFromServer();
  }
}

async function deleteTask(taskId) {
  const confirmed = window.confirm('Delete this task permanently?');
  if (!confirmed) {
    return;
  }

  try {
    await request(`/tasks/${taskId}`, { method: 'DELETE' });
    state.tasks = state.tasks.filter((task) => task.id !== taskId);
    renderTasks();
    setStatus('Task deleted successfully.');
  } catch (error) {
    setStatus(error.message, true);
  }
}

function handleSearch(event) {
  state.searchTerm = event.target.value.trim();
  renderTasks();
}

function handleSortChange(event) {
  state.sortValue = event.target.value;
  loadTasks();
}

async function reloadFromServer() {
  const tasks = await request(`/tasks${buildQueryString()}`);
  state.tasks = tasks;
  renderTasks();
}

function updateTaskInState(updatedTask) {
  state.tasks = state.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
}

function buildQueryString() {
  const [sort, orderToken] = state.sortValue.split('-');
  const order = orderToken === 'asc' ? 'asc' : 'desc';
  const params = new URLSearchParams({
    sort,
    order,
  });

  return `?${params.toString()}`;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong while contacting the server.');
  }

  return data;
}

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle('error', isError);
}

function exportTasks() {
  const dataStr = JSON.stringify(state.tasks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tasks-export.json';
  link.click();
  URL.revokeObjectURL(url);
  setStatus('Tasks exported as JSON.');
}