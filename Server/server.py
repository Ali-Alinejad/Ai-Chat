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

def create_separator(length=30):
    return "-" * length + "\n"

def create_separator(length=30):
    return "\u2500" * length + "\n"

def create_separator(length=40):
    return "\u2500" * length

def format_text(label, value):
   
    return f"{label}: \u202A{value}\u202C"

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '').lower()
    logger.info(f"Received chat message: {user_message}")
    
    if not sports_data:
        return jsonify({"response": "اطلاعات ورزشی هنوز دریافت نشده است. لطفاً کمی صبر کنید و دوباره تلاش کنید."}), 503
    
    if "تعداد ورزش" in user_message:
        return jsonify({"response": f"تعداد ورزش‌های موجود: {len(sports_data)}"})
    
    elif "لیست ورزش" in user_message:
        sports_list = "، ".join([sport['title'] for sport in sports_data])
        return jsonify({"response": f"لیست ورزش‌ها: {sports_list}"})
    
    elif "ورزش فعال" in user_message:
        active_sports = [sport['title'] for sport in sports_data if sport['active']]
        return jsonify({"response": f"ورزش‌های فعال: {'، '.join(active_sports)}"})
    
    else:
  
        matching_sports = [sport for sport in sports_data if sport['group'].lower() in user_message]
        
        if matching_sports:
            group = matching_sports[0]['group']
            response = f"اطلاعات گروه ورزشی {group}:\n\n"
            
            for sport in matching_sports:
                response += create_separator() + "\n"
                response += format_text("عنوان", sport['title']) + "\n"
                response += format_text("توضیحات", sport.get('description', 'اطلاعات در دسترس نیست')) + "\n"
                response += format_text("وضعیت", 'فعال' if sport['active'] else 'غیرفعال') + "\n"
                response += format_text("گروه", sport.get('group', 'نامشخص')) + "\n"
                response += format_text("کلید", sport['key']) + "\n"
                response += create_separator() + "\n\n"
            
            return jsonify({"response": response.strip()})
        

        return jsonify({
            "response": "متأسفانه نمی‌توانم به این سوال پاسخ دهم. لطفاً نام یک گروه ورزشی را بپرسید یا درباره تعداد ورزش‌ها، لیست ورزش‌ها، یا ورزش‌های فعال سوال کنید."
        })
@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Sports Chat API. Use /sports to get sports data and /chat for asking questions."

if __name__ == '__main__':
    try:
        fetch_sports_data()  
    except requests.RequestException as e:
        logger.error(f"Initial sports data fetch failed: {str(e)}")
    app.run(debug=True)