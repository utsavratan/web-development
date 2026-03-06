# Web Development Lab — Utsav Ratan

A collection of web development experiments and projects completed as part of a B.Tech Computer Science lab curriculum at K.R. Mangalam University. Each experiment progressively builds on core web technologies — from static HTML/CSS pages to a full-stack Node.js application.

---

## Repository Structure

```
web-development/
├── Experiment - I/          # Personal Portfolio Website
├── Experiement - II/        # THRYLOS Company Landing Page (HTML & CSS)
├── Experiment - III/        # THRYLOS Ecosystem Landing Page (Responsive)
├── Experiment - IV/         # THRYLOS Smart To-Do App (Full Stack)
└── webdevelopmentlabfile.pdf
```

---

## Experiments

### Experiment I — Personal Portfolio Website

**Technologies:** HTML, CSS, JavaScript

A personal portfolio website for Utsav Ratan built with semantic HTML, custom CSS styling (dark theme), and vanilla JavaScript.

**Features:**
- Responsive navigation with anchor links
- About, Education, Skills, Projects, Experience, and Contact sections
- Education table listing academic history
- Skills list for programming languages and tools (HTML, CSS, JavaScript, Python, C++, TypeScript, Git, React, Firebase, Supabase)
- Projects showcase (Thrylos Verification Platform, EduTrack, Thrylos Esports Platform, Portfolio Website)
- Experience section (Software Development Intern at Essentia.dev)
- Contact form with JavaScript form submission handler
- Interactive "Say Hi" button with alert

**Files:**
| File | Description |
|------|-------------|
| `index.html` | Main portfolio page |
| `main.html` | THRYLOS Landing Page (Experiment II content, see below) |
| `style.css` | Dark-themed styles for the portfolio |
| `script.js` | Welcome alert and form submission handler |

---

### Experiment II — THRYLOS Company Landing Page

**Technologies:** HTML, CSS

A static company landing page for THRYLOS — an esports and technology platform. Focuses on clean HTML structure and CSS layout.

**Features:**
- Hero section introducing the THRYLOS brand
- About section describing the platform's mission
- Services section with three cards: Esports Tournament Platform, Digital Wallet & Secure Payments, Community & Event Management
- User testimonials
- Contact section with a query form
- Professional dark/branded footer

**Files:**
| File | Description |
|------|-------------|
| `index.html` | Landing page markup |
| `style.css` | Page styles and layout |
| `thrylosbg.png` | THRYLOS brand logo/background image |

---

### Experiment III — THRYLOS Ecosystem Landing Page (Responsive)

**Technologies:** HTML, CSS, JavaScript (Vanilla), Google Fonts (Inter)

A fully responsive, production-quality company landing page for the entire THRYLOS ecosystem. Built with a mobile-first approach and accessible markup.

**Features:**
- Responsive navbar with hamburger menu toggle (JavaScript-powered)
- Hero section with call-to-action buttons
- Ecosystem grid showcasing five THRYLOS products:
  - **THRYLOS Gaming** — tournaments, matchmaking, leaderboards ([thrylos.in](https://thrylos.in))
  - **THRYLOS Tech** — APIs, SDKs, automation systems ([tech.thrylos.in](https://tech.thrylos.in))
  - **THRYLOS Desk** — student dashboards, certificates, role-based access ([thrylosdesk.thrylos.in](https://thrylosdesk.thrylos.in))
  - **Verification** — public certificate & document verification ([verify.thrylos.in](https://verify.thrylos.in))
  - **Careers** — open roles, internships, engineering culture ([careers.thrylos.in](https://careers.thrylos.in))
- Core Focus Areas grid (Gaming Infrastructure, Educational Platforms, Automation Systems, Product Engineering)
- Contact form with client-side validation and `mailto:` fallback
- Fully accessible footer with navigation

**Files:**
| File | Description |
|------|-------------|
| `index.html` | Full ecosystem landing page |
| `style.css` | Responsive layout and component styles |
| `script.js` | Mobile nav toggle logic |

---

### Experiment IV — THRYLOS Smart To-Do App (Full Stack)

**Technologies:** Node.js, Express.js, HTML, CSS, JavaScript, Brevo (email API), node-cron, dotenv, UUID, Vite (dev)

A full-stack task management application with user authentication, CRUD operations, and automated email reminders using the Brevo transactional email API.

#### Client (`client/`)

| File | Description |
|------|-------------|
| `login.html` | Login/signup page |
| `dashboard.html` | Authenticated task dashboard |
| `script.js` | API calls for auth, task management, and UI updates |
| `style.css` | Dashboard and auth styles |

**Client Features:**
- Login and signup forms
- Task dashboard showing user-specific tasks
- Add, edit, complete, and delete tasks
- Datetime picker for scheduling tasks
- Auto-sync with backend

#### Server (`server/`)

| File | Description |
|------|-------------|
| `server.js` | Main Express server with all API routes |
| `db.json` | JSON file database (users and tasks) |
| `reminderTemplate.js` | HTML email template for task reminders |
| `completionTemplate.js` | HTML email template for task completion |

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/test` | API status check |
| POST | `/signup` | Register a new user |
| POST | `/login` | Authenticate a user |
| POST | `/task` | Create a new task |
| GET | `/tasks?email=` | Fetch all tasks for a user |
| PATCH | `/task/:id` | Update task title or datetime |
| POST | `/complete/:id` | Mark task as complete + send email |
| DELETE | `/task/:id` | Delete a task |

**Server Features:**
- Express REST API with CORS support
- JSON file-based persistence (`db.json`)
- UUID-based unique IDs for users and tasks
- Brevo transactional email integration (reminder and completion emails)
- node-cron job that runs every minute to send reminders ~10 minutes before task due time
- Environment variable configuration via `.env`

#### Running Experiment IV

**Prerequisites:** Node.js installed

```bash
cd "Experiment - IV"
npm install
```

Create a `.env` file in the `server/` directory:

```env
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_sender_email@example.com
PORT=5001
```

Start the server:

```bash
npm start
# Server runs at http://localhost:5001
```

Open `client/login.html` in a browser (or serve with Vite: `npx vite`).

> **Note:** Email reminders are optional. If `BREVO_API_KEY` is not set, the server still runs and all task features work — email sends are simulated and logged to the console.

---

## Author

**Utsav Ratan**  
B.Tech Computer Science, K.R. Mangalam University (2024–2028)  
- GitHub: [github.com/utsavratan](https://github.com/utsavratan)  
- LinkedIn: [linkedin.com/in/misterutsav](https://linkedin.com/in/misterutsav)  
- Email: utsav@thrylos.in