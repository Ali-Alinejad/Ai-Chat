import "./normalize.css";
function App() {
  return (
    <>
      <div className="flex">
        <div className="w-[35%] bg-emerald-950 h-[100vh] text-center">
          <h1 className="text-cyan-50 text-3xl m-10 max-sm:scale-50 max-sm:m-0">
            Chat AI
          </h1>
          <p className="border-b-[1px] m-6 border-white"></p>

          <button
            className="border-2 p-4 rounded-md m-4 w-[80%] text-white hover:scale-105 transition duration-500 font-semibold max-sm:scale-75 max-sm:font-normal max-sm:w-full max-sm:m-0"
            aria-label="New Chat"
          >
            <span className="animate-pulse">➕</span> چت جدید
          </button>
        </div>
        <div className="w-full bg-slate-300 h-[100vh]">
          <div>
            <input
              className="w-[60%] h-20 rounded-xl shadow-lg ring-2 ring-emerald-400 p-4 absolute bottom-[10%] right-[12%] text-end"
              type="text"
              placeholder="سوال خود را بپرسید"
              aria-label="Ask your question"
            />
            <button
              className="rounded-xl absolute bottom-[13%] right-[7%] scale-[4] max-sm:scale-[2] max-sm:right-[4%] hover:animate-pulse hover:scale-[3.5] transition duration-700"
              aria-label="Send"
            >
              ➡️
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
