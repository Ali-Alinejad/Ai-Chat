from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # این خط برای اجازه دادن به درخواست‌های CORS است

AI_API_KEY = "YOUR_AI_API_KEY"  # کلید API خود را اینجا قرار دهید
AI_API_URL = "https://api.openai.com/v1/chat/completions"  # یا هر API دیگری که استفاده می‌کنید

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data['message']

    response = requests.post(
        AI_API_URL,
        headers={
            "Authorization": f"Bearer {AI_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": user_message}]
        }
    )

    if response.status_code == 200:
        ai_response = response.json()['choices'][0]['message']['content']
        return jsonify({"response": ai_response})
    else:
        return jsonify({"error": "Failed to get response from AI"}), 500

if __name__ == '__main__':
    app.run(debug=True)