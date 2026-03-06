const API = "http://localhost:5001";

/* ---------- SIGNUP ---------- */
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const text = await res.text();

  if (res.ok) {
    alert("Signup successful. Now login.");
  } else {
    alert(text);
  }
}

/* ---------- LOGIN ---------- */
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    alert("Invalid login");
    return;
  }

  const user = await res.json();
  localStorage.setItem("user", JSON.stringify(user));

  window.location.href = "dashboard.html";
}

/* ---------- CHECK LOGIN ---------- */
function checkLogin() {
  if (!localStorage.getItem("user")) {
    window.location.href = "login.html";
  }
  // if on dashboard, load tasks
  if (document.getElementById('taskList')) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && document.getElementById('userEmail')) {
      document.getElementById('userEmail').innerText = user.email;
    }
    loadTasks();
  }
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

/* ---------- ADD TASK ---------- */
async function addTask() {
  const title = document.getElementById('title').value;
  const datetime = document.getElementById('time').value;

  if (!title || !datetime) {
    alert('Please provide title and time');
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return window.location.href = 'login.html';

  const payload = {
    title,
    datetime: new Date(datetime).toISOString(),
    email: user.email,
    username: user.email
  };

  const res = await fetch(API + '/task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    alert('Error: ' + text);
    return;
  }

  document.getElementById('title').value = '';
  document.getElementById('time').value = '';
  loadTasks();
}

/* ---------- LOAD TASKS ---------- */
async function loadTasks() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return window.location.href = 'login.html';

  const res = await fetch(API + '/tasks?email=' + encodeURIComponent(user.email));
  if (!res.ok) return console.error('Could not load tasks');

  const tasks = await res.json();
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  tasks.sort((a,b)=> new Date(a.datetime) - new Date(b.datetime));

  tasks.forEach(t => {
    const li = document.createElement('li');
    li.style.margin = '0';

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const titleRow = document.createElement('div');
    titleRow.className = 'task-title-row';
    const title = document.createElement('div');
    title.innerText = t.title + (t.completed ? ' (Completed)' : '');
    titleRow.appendChild(title);

    const time = document.createElement('div');
    time.className = 'task-time';
    time.innerText = new Date(t.datetime).toLocaleString();

    meta.appendChild(titleRow);
    meta.appendChild(time);

    const controls = document.createElement('div');
    controls.className = 'controls';

    if (!t.completed) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.innerText = 'Complete';
      btn.onclick = () => completeTask(t.id);
      controls.appendChild(btn);
    }

    const editBtn = document.createElement('button');
    editBtn.className = 'btn secondary';
    editBtn.innerText = 'Edit';
    editBtn.onclick = () => editTask(t.id);
    controls.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.className = 'btn delete';
    delBtn.innerText = 'Delete';
    delBtn.onclick = () => deleteTask(t.id);
    controls.appendChild(delBtn);

    li.appendChild(meta);
    li.appendChild(controls);
    list.appendChild(li);
  });
}

/* ---------- COMPLETE TASK ---------- */
async function completeTask(id) {
  const res = await fetch(API + '/complete/' + id, {
    method: 'POST'
  });

  if (!res.ok) {
    const text = await res.text();
    alert('Error: ' + text);
    return;
  }

  loadTasks();
}

/* ---------- EDIT TASK ---------- */
async function editTask(id) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return window.location.href = 'login.html';

  // fetch current task details
  const resAll = await fetch(API + '/tasks?email=' + encodeURIComponent(user.email));
  if (!resAll.ok) return alert('Could not fetch task');
  const tasks = await resAll.json();
  const task = tasks.find(t => t.id === id);
  if (!task) return alert('Task not found');

  const newTitle = prompt('Edit title', task.title);
  if (newTitle === null) return; // cancelled

  const curLocal = new Date(task.datetime).toISOString().slice(0,16);
  const newTime = prompt('Edit time (YYYY-MM-DDTHH:MM)', curLocal);
  if (newTime === null) return;

  const payload = { title: newTitle, datetime: new Date(newTime).toISOString() };

  const res = await fetch(API + '/task/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    alert('Error: ' + text);
    return;
  }

  loadTasks();
}

/* ---------- DELETE TASK ---------- */
async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;

  const res = await fetch(API + '/task/' + id, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text();
    alert('Error: ' + text);
    return;
  }

  loadTasks();
}