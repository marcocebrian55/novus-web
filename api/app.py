import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv

load_dotenv()

# ── Rutas ────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
DIST_DIR   = os.path.join(BASE_DIR, '..', 'dist')

app = Flask(__name__, static_folder=DIST_DIR, static_url_path='')
CORS(app)

# ── Flask-Mail ───────────────────────────────────────────────
app.config['MAIL_SERVER']         = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT']           = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS']        = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME']       = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD']       = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
MAIL_RECIPIENT                    = os.getenv('MAIL_RECIPIENT', 'pablo.garcia@novus-iberica.com')

mail = Mail(app)


# ── /api/contact ─────────────────────────────────────────────
@app.route('/api/contact', methods=['POST'])
def contact():
    data    = request.get_json() or {}
    name    = data.get('name', '—')
    email   = data.get('email', '—')
    phone   = data.get('phone', '—')
    service = data.get('service', '—')
    message = data.get('message', '—')

    subject = f'Nueva consulta web — {name} ({service})'
    body = f"""
Nueva consulta recibida desde novus-iberica.com
================================================

Nombre:   {name}
Email:    {email}
Teléfono: {phone}
Servicio: {service}

Mensaje:
{message}
================================================
Responde directamente a: {email}
"""
    try:
        msg = Message(subject=subject, recipients=[MAIL_RECIPIENT], body=body)
        msg.reply_to = email
        mail.send(msg)
    except Exception as e:
        print(f'[MAIL ERROR] {e}')
        print(f'[LOG] Consulta de {name} <{email}> — {service}: {message}')

    return jsonify({'ok': True}), 200


# ── /api/calculator/mortgage ──────────────────────────────────
@app.route('/api/calculator/mortgage', methods=['POST'])
def mortgage_calculator():
    data = request.get_json() or {}
    try:
        principal    = float(data['principal'])
        current_rate = float(data['current_rate'])
        new_rate     = float(data['new_rate'])
        years        = int(data['years'])
    except (KeyError, ValueError, TypeError) as e:
        return jsonify({'error': str(e)}), 400

    def calc(p, annual_rate, y):
        n = y * 12
        r = annual_rate / 100 / 12
        if r == 0:
            monthly = p / n
        else:
            monthly = p * r * (1 + r)**n / ((1 + r)**n - 1)
        total    = monthly * n
        return {
            'monthly':  round(monthly, 2),
            'total':    round(total, 2),
            'interest': round(total - p, 2)
        }

    current  = calc(principal, current_rate, years)
    new      = calc(principal, new_rate,     years)

    return jsonify({
        'current': current,
        'new':     new,
        'savings': {
            'monthly': round(current['monthly']  - new['monthly'],  2),
            'total':   round(current['interest'] - new['interest'], 2)
        }
    }), 200


# ── /api/properties ──────────────────────────────────────────
@app.route('/api/properties', methods=['GET'])
def list_properties():
    return jsonify([
        { 'id': 1, 'type': 'Piso', 'city': 'Valladolid', 'price': 180000, 'sqm': 95, 'status': 'available' },
        { 'id': 2, 'type': 'Local comercial', 'city': 'Valladolid', 'price': 120000, 'sqm': 80, 'status': 'available' }
    ]), 200


# ── Sirve React (todas las rutas no-API) ──────────────────────
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    # Si existe el archivo estático (js, css, imágenes...) lo sirve directamente
    full = os.path.join(app.static_folder, path)
    if path and os.path.exists(full):
        return send_from_directory(app.static_folder, path)
    # En cualquier otra ruta, devuelve index.html (React Router se encarga)
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
