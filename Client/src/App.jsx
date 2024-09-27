import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./normalize.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sportsData, setSportsData] = useState([]);

 
  const fetchSportsData = async () => {
    try {
      const response = await fetch("http://localhost:5000/sports");
      const data = await response.json();
      setSportsData(data);
      setMessages([
        {
          type: "ai",
          content:
            "اطلاعات ورزشی دریافت شد. چه سوالی دارید؟ می‌توانید درباره تعداد ورزش‌ها، لیست ورزش‌ها، ورزش‌های فعال یا جزئیات یک ورزش خاص بپرسید.",
        },
      ]);
    } catch (error) {
      console.error("Error fetching sports data:", error);
      setMessages([
        { type: "ai", content: "متأسفانه در دریافت اطلاعات مشکلی پیش آمد." },
      ]);
    }
  };

  const handleSend = async () => {
    if (input.trim() !== "") {
      setMessages([...messages, { type: "user", content: input }]);
      setInput("");

      try {
        const response = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        setMessages((msgs) => [
          ...msgs,
          { type: "ai", content: data.response },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((msgs) => [
          ...msgs,
          { type: "ai", content: "متأسفانه در ارتباط با سرور مشکلی پیش آمد." },
        ]);
      }
    }
  };

  const renderSportsList = () => {
    const groups = {};
    sportsData.forEach((sport) => {
      if (!groups[sport.group]) {
        groups[sport.group] = [];
      }
      groups[sport.group].push(sport);
    });

    return Object.entries(groups).map(([group, sports]) => (
      <div key={group} className="mb-4 ">
        <h3 className="text-xl font-bold mb-2 ">{group}</h3>
        <ul className="list-disc pl-5">
          {sports.map((sport) => (
            <li key={sport.key} className="mb-1  border-b-2 ">
              {sport.title} - {sport.description}
              {sport.active ? " (فعال)" : " (غیرفعال)"}
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-indigo-700 text-white p-6 shadow-lg overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Chat AI</h1>
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md mb-4"
          onClick={fetchSportsData}
        >
          <span className="mr-2">🔄</span> بروزرسانی اطلاعات ورزشی
        </button>
        {renderSportsList()}
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div id="chatBox" className="flex-1 p-6 overflow-y-auto">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              } mb-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="relative flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="w-full pr-12 pl-4 py-3 rounded-full border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              type="text"
              placeholder="سوال خود را بپرسید"
              aria-label="Ask your question"
            />
            <button
              onClick={handleSend}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 text-2xl transition duration-300 ease-in-out scale-150 ml-4"
              aria-label="Send"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
