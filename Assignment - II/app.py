

from flask import Flask, render_template, request, redirect, url_for, session, flash
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'eventmanagement_secret_key_2025'
app.config['DEBUG'] = True

# ─────────────────────────────────────────────
#  In-memory data store (no database needed)
# ─────────────────────────────────────────────
events = [
    {
        'id': 1,
        'name': 'TechFest 2025',
        'date': '2025-07-15',
        'time': '10:00 AM',
        'venue': 'Convention Centre, Hall A',
        'description': 'A premier technology festival featuring talks, workshops, and hackathons from industry leaders and innovators.',
        'category': 'Technology',
        'image': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
        'rsvp': 142
    },
    {
        'id': 2,
        'name': 'Cultural Night Gala',
        'date': '2025-07-22',
        'time': '06:00 PM',
        'venue': 'Open Air Amphitheatre',
        'description': 'An enchanting evening celebrating diverse cultures through music, dance, art, and cuisine from around the world.',
        'category': 'Cultural',
        'image': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
        'rsvp': 89
    },
    {
        'id': 3,
        'name': 'Sports Day Championship',
        'date': '2025-08-05',
        'time': '08:00 AM',
        'venue': 'Main Sports Complex',
        'description': 'Annual inter-college sports championship featuring athletics, team sports, and individual competitions.',
        'category': 'Sports',
        'image': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
        'rsvp': 210
    },
    {
        'id': 4,
        'name': 'Art & Design Expo',
        'date': '2025-08-12',
        'time': '11:00 AM',
        'venue': 'Gallery Wing, Block C',
        'description': 'Showcase of student and professional artwork, design portfolios, installations and creative exhibitions.',
        'category': 'Arts',
        'image': 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80',
        'rsvp': 67
    },
    {
        'id': 5,
        'name': 'Music Fest Live',
        'date': '2025-08-20',
        'time': '05:00 PM',
        'venue': 'Central Plaza Stage',
        'description': 'Live performances by student bands and professional artists. Enjoy an electrifying night of music.',
        'category': 'Music',
        'image': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
        'rsvp': 320
    },
    {
        'id': 6,
        'name': 'Entrepreneurship Summit',
        'date': '2025-09-01',
        'time': '09:00 AM',
        'venue': 'Seminar Hall 1 & 2',
        'description': 'Connect with startup founders, VCs and mentors. Pitch your ideas and win seed funding opportunities.',
        'category': 'Business',
        'image': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
        'rsvp': 178
    },
]

registrations = []
next_event_id = 7


# ─────────────────────────────────────────────
#  Helper
# ─────────────────────────────────────────────
def get_event_by_id(event_id):
    return next((e for e in events if e['id'] == event_id), None)


# ─────────────────────────────────────────────
#  Routes
# ─────────────────────────────────────────────

@app.route('/')
def index():
    featured = events[:3]
    return render_template('index.html', featured_events=featured, total_events=len(events))


@app.route('/events')
def event_list():
    category = request.args.get('category', 'All')
    search = request.args.get('search', '').strip().lower()
    filtered = events
    if category and category != 'All':
        filtered = [e for e in filtered if e['category'] == category]
    if search:
        filtered = [e for e in filtered if search in e['name'].lower() or search in e['description'].lower()]
    categories = ['All'] + sorted(set(e['category'] for e in events))
    return render_template('events.html', events=filtered, categories=categories,
                           selected_category=category, search=search)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        event_id = request.form.get('event_id')
        tickets = request.form.get('tickets', 1)

        if not all([name, email, phone, event_id]):
            flash('Please fill in all required fields.', 'error')
            return redirect(url_for('register'))

        event = get_event_by_id(int(event_id))
        if event:
            event['rsvp'] = event.get('rsvp', 0) + int(tickets)

        registrations.append({
            'name': name, 'email': email, 'phone': phone,
            'event_id': int(event_id), 'tickets': int(tickets),
            'registered_at': datetime.now().strftime('%Y-%m-%d %H:%M')
        })
        flash(f'🎉 Registration successful! You\'re registered for {event["name"] if event else "the event"}.', 'success')
        return redirect(url_for('register'))

    event_id = request.args.get('event_id')
    return render_template('register.html', events=events, preselected=event_id)


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        password = request.form.get('password')
        if password == 'admin123':
            session['admin'] = True
            flash('Welcome back, Admin!', 'success')
        else:
            flash('Invalid password.', 'error')
        return redirect(url_for('admin'))

    if not session.get('admin'):
        return render_template('admin_login.html')

    return render_template('admin.html', events=events, registrations=registrations)


@app.route('/admin/logout')
def admin_logout():
    session.pop('admin', None)
    flash('Logged out successfully.', 'success')
    return redirect(url_for('index'))


@app.route('/admin/add', methods=['POST'])
def admin_add():
    global next_event_id
    if not session.get('admin'):
        return redirect(url_for('admin'))

    new_event = {
        'id': next_event_id,
        'name': request.form.get('name', '').strip(),
        'date': request.form.get('date', ''),
        'time': request.form.get('time', ''),
        'venue': request.form.get('venue', '').strip(),
        'description': request.form.get('description', '').strip(),
        'category': request.form.get('category', 'Other'),
        'image': request.form.get('image', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'),
        'rsvp': 0
    }
    events.append(new_event)
    next_event_id += 1
    flash(f'Event "{new_event["name"]}" added successfully!', 'success')
    return redirect(url_for('admin'))


@app.route('/admin/edit/<int:event_id>', methods=['GET', 'POST'])
def admin_edit(event_id):
    if not session.get('admin'):
        return redirect(url_for('admin'))
    event = get_event_by_id(event_id)
    if not event:
        flash('Event not found.', 'error')
        return redirect(url_for('admin'))

    if request.method == 'POST':
        event['name'] = request.form.get('name', event['name']).strip()
        event['date'] = request.form.get('date', event['date'])
        event['time'] = request.form.get('time', event['time'])
        event['venue'] = request.form.get('venue', event['venue']).strip()
        event['description'] = request.form.get('description', event['description']).strip()
        event['category'] = request.form.get('category', event['category'])
        event['image'] = request.form.get('image', event['image'])
        flash(f'Event "{event["name"]}" updated successfully!', 'success')
        return redirect(url_for('admin'))

    return render_template('admin_edit.html', event=event)


@app.route('/admin/delete/<int:event_id>')
def admin_delete(event_id):
    if not session.get('admin'):
        return redirect(url_for('admin'))
    global events
    event = get_event_by_id(event_id)
    if event:
        events = [e for e in events if e['id'] != event_id]
        flash(f'Event "{event["name"]}" deleted.', 'success')
    else:
        flash('Event not found.', 'error')
    return redirect(url_for('admin'))


if __name__ == '__main__':
    app.run(debug=True)
