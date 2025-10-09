import React, { useState, useEffect } from "react";

export default function XSSGame() {
  const [input, setInput] = useState("");
  const [display, setDisplay] = useState("");
  const [hint, setHint] = useState("");
  const [unsafeMode, setUnsafeMode] = useState(false); // true = Unsafe Mode, scripts run
  const [comments, setComments] = useState([
    { user: "Alice", text: "This is a great post! 😊" },
    { user: "Bob", text: "I learned a lot about web security here." },
  ]);

  // Execute scripts in unsafe mode
  useEffect(() => {
    if (unsafeMode) {
      comments.forEach((c) => {
        if (c.html) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = c.html;
          const scripts = tempDiv.querySelectorAll("script");
          scripts.forEach((s) => {
            try {
              // eslint-disable-next-line no-eval
              eval(s.innerText);
            } catch (err) {
              console.error("Script execution error:", err);
            }
          });
        }
      });
    }
  }, [comments, unsafeMode]);

  function renderComment() {
    if (!input.trim()) {
      setDisplay("Please enter a comment first.");
      return;
    }

    if (unsafeMode) {
      // Unsafe Mode → scripts are executed
      setComments([...comments, { user: "You", html: input }]);
      setDisplay("⚠️ Unsafe Mode — scripts may execute!");
    } else {
      // Safe Mode → scripts are blocked
      if (/<script>/i.test(input)) {
        setDisplay("✅ Safe Mode — script blocked!");
      } else {
        setComments([...comments, { user: "You", text: input }]);
        setDisplay("✅ Comment posted safely!");
      }
    }

    setInput("");
  }

  const showHint = () => {
    setHint(
      "💡 Unsafe Mode: scripts run (simulates vulnerable site). " +
        "Safe Mode: scripts are blocked (good practice). Try posting <script> tags to see the difference!"
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full md:min-w-lg max-w-lg md:max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        🧩 XSS Simulation Game
      </h2>

      {/* Switch layout */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
        <span
          className={`text-sm font-medium ${
            unsafeMode ? "text-red-600" : "text-gray-400"
          }`}
        >
          Unsafe Mode
        </span>

        <div
          onClick={() => setUnsafeMode(!unsafeMode)}
          className={`w-14 h-7 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
            unsafeMode ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
              unsafeMode ? "translate-x-1" : "translate-x-7"
            }`}
          ></div>
        </div>

        <span
          className={`text-sm font-medium ${
            !unsafeMode ? "text-green-600" : "text-gray-400"
          }`}
        >
          Safe Mode
        </span>
      </div>

      {/* Comment section */}
      <div className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50">
        <h3 className="font-semibold mb-2">💬 Comment Section</h3>
        {comments.map((c, i) => (
          <p key={i} className="mb-1 text-gray-700">
            <span className="font-semibold">{c.user}: </span>
            {c.html ? (
              <span
                dangerouslySetInnerHTML={{ __html: c.html }}
                className="text-red-600"
              ></span>
            ) : (
              c.text
            )}
          </p>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Try typing something like <script>alert("XSS")</script>'
        className="w-full border border-blue-200 rounded-lg p-2 mb-3"
      />

      {/* Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={renderComment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Post
        </button>
        <button
          onClick={showHint}
          className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200"
        >
          Hint
        </button>
      </div>

      {/* Feedback */}
      {display && (
        <p
          className={`mt-4 p-2 rounded text-sm text-center ${
            display.includes("blocked")
              ? "bg-green-100 text-green-800"
              : display.includes("Unsafe")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {display}
        </p>
      )}

      {/* Hint section */}
      {hint && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
          {hint}
        </div>
      )}
    </div>
  );
}
