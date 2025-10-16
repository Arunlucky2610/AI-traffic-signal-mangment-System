from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return jsonify({'message': 'Flask backend is running!'})

@app.route('/api/status')
def status():
    return jsonify({'status': 'ok', 'service': 'AI Emergency Detection'})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
