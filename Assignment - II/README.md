<<<<<<< HEAD
# Capstone_Project_WebDevelopment
=======
# EventHub — Event Management Website

A fully functional event management web app built with **Flask + HTML + CSS + JavaScript** for the Web Development Lab.

## 📁 Project Structure
```
event_management_website/
├── app.py               # Flask entry point
├── requirements.txt
├── README.md
├── templates/
│   ├── base.html        # Shared layout (navbar, footer)
│   ├── index.html       # Home / Landing page
│   ├── events.html      # Events listing (with search + filter)
│   ├── register.html    # Registration form
│   ├── admin_login.html # Admin login page
│   ├── admin.html       # Admin dashboard
│   └── admin_edit.html  # Edit event form
└── static/
    ├── css/style.css    # All styles (responsive, dark theme)
    └── js/script.js     # Validation, live search, animations
```

## 🚀 How to Run
```bash
pip install flask
python app.py
```
Open http://localhost:5000 in your browser.

## 🔑 Admin Access
- URL: http://localhost:5000/admin
- Password: `admin123`

## ✅ Features
- Home page with hero, featured events, how-it-works, CTA
- Events listing with **live JS search** and **category filter**
- Registration form with **client-side JS validation**
- Admin panel: Add / Edit / Delete events, view registrations
- Flash messages (success / error)
- Fully **mobile responsive**
- Dark theme with smooth animations
>>>>>>> 01469c1 (added)
