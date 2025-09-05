from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({'message': 'Flask backend is running!'})

@app.route('/api/status')
def status():
    return jsonify({'status': 'ok', 'service': 'AI Emergency Detection'})

if __name__ == '__main__':
    app.run(debug=True)
