import { useState } from "react";
import { motion } from "framer-motion";
import "./normalize.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { type: "user", content: input }]);
      setInput("");
      // اینجا می‌توانید لاجیک ارسال پیام به AI و دریافت پاسخ را اضافه کنید
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { type: "ai", content: "این یک پاسخ نمونه از AI است." },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-indigo-700 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-8">Chat AI</h1>
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          aria-label="New Chat"
        >
          <span className="mr-2">➕</span> چت جدید
        </button>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div id="chatBox" className="flex-1 p-6 ">
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
              className="w-full pr-12 pl-4 py-3 rounded-full border border-blue-500 focus:outline-none focus:ring-2  focus:ring-blue-500 text-right"
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
