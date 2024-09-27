from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from datetime import datetime, timedelta
import logging

app = Flask(__name__)
CORS(app)

# تنظیم لاگینگ
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sports_data = []
last_fetch_time = None

API_KEY = os.environ.get('API_KEY', 'OUq1wAq9Sat6wh3SO0KrM7pCQIxARSmL')
CACHE_DURATION = timedelta(hours=1)

def fetch_sports_data():
    global sports_data, last_fetch_time
    url = "https://api.apilayer.com/odds/sports"
    
    headers = {
        "apikey": API_KEY
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        sports_data = response.json()
        last_fetch_time = datetime.now()
        logger.info("Sports data fetched successfully")
    except requests.RequestException as e:
        logger.error(f"Error fetching sports data: {str(e)}")
        raise

@app.route('/sports', methods=['GET'])
def get_sports():
    global sports_data, last_fetch_time
    
    if not sports_data or (datetime.now() - last_fetch_time > CACHE_DURATION):
        try:
            fetch_sports_data()
        except requests.RequestException as e:
            return jsonify({"error": str(e)}), 500
    
    return jsonify(sports_data), 200

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '').lower()
    logger.info(f"Received chat message: {user_message}")
    
    if not sports_data:
        return jsonify({"response": "اطلاعات ورزشی هنوز دریافت نشده است. لطفاً کمی صبر کنید و دوباره تلاش کنید."}), 503
    
    if "تعداد ورزش" in user_message:
        return jsonify({"response": f"تعداد ورزش‌های موجود: {len(sports_data)}"})
    
    elif "لیست ورزش" in user_message:
        sports_list = ", ".join([sport['title'] for sport in sports_data])
        return jsonify({"response": f"لیست ورزش‌ها: {sports_list}"})
    
    elif "ورزش فعال" in user_message:
        active_sports = [sport['title'] for sport in sports_data if sport['active']]
        return jsonify({"response": f"ورزش‌های فعال: {', '.join(active_sports)}"})
    
    elif "جزئیات ورزش" in user_message:
        sport_name = user_message.split("جزئیات ورزش")[-1].strip()
        for sport in sports_data:
            if sport_name.lower() in sport['title'].lower():
                return jsonify({"response": f"جزئیات {sport['title']}: {sport['description']}, فعال: {'بله' if sport['active'] else 'خیر'}"})
        return jsonify({"response": "ورزش مورد نظر یافت نشد."})
    
    else:
        return jsonify({"response": "متأسفانه نمی‌توانم به این سوال پاسخ دهم. لطفاً درباره تعداد ورزش‌ها، لیست ورزش‌ها، ورزش‌های فعال یا جزئیات یک ورزش خاص بپرسید."})

if __name__ == '__main__':
    app.run(debug=True)