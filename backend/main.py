from flask import Flask, request, jsonify
from flask_cors import CORS
from algorithms.bankers import is_safe_state  # Ensure this function is implemented in algorithms/bankers.py
from algorithms.wait_for_graph import detect_cycle
from algorithms.rag import rag_to_wfg

app = Flask(__name__)
CORS(app)

@app.route('/api/bankers', methods=['POST'])
def run_bankers():
    data = request.json
    is_safe, sequence = is_safe_state(data['available'], data['max'], data['allocation'])
    return jsonify({"safe": is_safe, "sequence": sequence})

@app.route('/api/waitfor', methods=['POST'])
def check_waitfor():
    graph = request.json['graph']
    has_deadlock = detect_cycle(graph)
    return jsonify({"deadlock": has_deadlock})

@app.route('/api/rag', methods=['POST'])
def convert_rag():
    rag = request.json['rag']
    wfg = rag_to_wfg(rag)
    return jsonify({"wait_for_graph": wfg})

if __name__ == '__main__':
    app.run(debug=True)