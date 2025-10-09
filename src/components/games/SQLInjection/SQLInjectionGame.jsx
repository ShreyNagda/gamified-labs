// src/SQLInjectionGame.jsx
import React, { useState } from "react";

/*
  Frontend-only SQLi simulation (educational).
  - unsafeQuery = true  => Vulnerable (injection can succeed)
  - unsafeQuery = false => Protected (injection blocked)
*/

export default function SQLInjectionGame() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [unsafeQuery, setUnsafeQuery] = useState(true); // default to Vulnerable for testing
  const [result, setResult] = useState("");
  const [hint, setHint] = useState("");

  // Mock DB (frontend-only, safe simulation)
  const mockDB = { admin: "admin123", user: "userpass" };

  // Build a simulated SQL string (unsafe example) so users can see the danger
  function simulatedQuery(u, p) {
    // This shows the dangerous concatenation pattern (do NOT do this in real code)
    return `SELECT * FROM users WHERE username = '${u}' AND password = '${p}';`;
  }

  // Loose, tolerant detection for common SQLi payloads.
  // Accepts payloads in username OR password, covers many spacing/quote variations.
  function isInjection(u, p) {
    const U = String(u || "");
    const P = String(p || "");
    const combined = (U + " " + P).toLowerCase();

    const patterns = [
      /'\s*or\s*'?\s*1\s*'?\s*=\s*'?\s*1/, // variations of ' OR '1'='1
      /\bor\s+1\s*=\s*1\b/, // OR 1=1
      /--/, // SQL comment
      /;|\bunion\b|\bselect\b/, // statement chaining / union/select usage
      /'"\s*or\s*'"/, // "' or '"
      /["']\s*=\s*["']/, // "'='"
    ];

    return patterns.some((re) => re.test(combined));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setResult("");

    const injectionDetected = isInjection(username, password);

    if (unsafeQuery) {
      // Vulnerable behavior: concatenated query simulation => injection can succeed
      if (injectionDetected) {
        setResult(
          "⚠️ Injection successful (simulated). Authentication bypassed!\n\n" +
            "Simulated query that would have run:\n" +
            simulatedQuery(username, password)
        );
        return;
      }

      // If no injection payload, normal mock DB check
      if (mockDB[username] && mockDB[username] === password) {
        setResult("✅ Logged in successfully (simulated).");
      } else {
        setResult("❌ Invalid credentials.");
      }
    } else {
      // Safe behavior: suspicious inputs are rejected / blocked
      if (injectionDetected) {
        setResult(
          "🛡️ Safe query prevented the injection — input rejected (simulated).\n\n" +
            "Simulated safe query (parameterized):\n" +
            "SELECT * FROM users WHERE username = ? AND password = ?"
        );
        return;
      }

      if (mockDB[username] && mockDB[username] === password) {
        setResult("✅ Logged in successfully (simulated).");
      } else {
        setResult("❌ Invalid credentials.");
      }
    }
  }

  const showHint = () => {
    setHint(
      "💡 SQL Injection occurs when user input is concatenated into SQL queries.\n\n" +
        "Test payloads (paste into Username or Password when switch is set to UNSAFE):\n" +
        " • anything' OR '1'='1\n" +
        " • OR 1=1 --\n" +
        " • admin' --\n\n" +
        "In SAFE mode the same inputs are detected and blocked (simulating parameterized queries / validation).\n\n" +
        "Teaching tip: examine the 'Simulated query' printed on injection success to see why concatenation is dangerous."
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full md:min-w-lg max-w-lg md:max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        🧪 SQL Injection Simulation
      </h2>

      {/* Centered switch with labels on left/right */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
        <span
          className={`text-sm font-medium ${
            unsafeQuery ? "text-red-600" : "text-gray-400"
          }`}
        >
          Unsafe Query
        </span>

        <div
          onClick={() => setUnsafeQuery((v) => !v)}
          role="button"
          aria-pressed={unsafeQuery}
          className={`w-14 h-7 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
            unsafeQuery ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
              unsafeQuery ? "translate-x-1" : "translate-x-7"
            }`}
          />
        </div>

        <span
          className={`text-sm font-medium ${
            !unsafeQuery ? "text-green-600" : "text-gray-400"
          }`}
        >
          Safe Query
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border border-blue-200 rounded-lg p-2"
          autoComplete="username"
        />

        <input
          type="text"
          // show as text so you can test injection in password too easily
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-blue-200 rounded-lg p-2"
          autoComplete="current-password"
        />

        <div className="flex gap-3 justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={showHint}
            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200"
          >
            Hint
          </button>
        </div>
      </form>

      {/* Result block (preserve newlines) */}
      {result && (
        <pre
          className={`mt-4 p-3 rounded text-sm whitespace-pre-wrap ${
            result.includes("Injection")
              ? "bg-red-100 text-red-800"
              : result.includes("Safe query")
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {result}
        </pre>
      )}

      {hint && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm whitespace-pre-wrap">
          {hint}
        </div>
      )}

      <div className="mt-4 text-xs text-slate-500 text-center">
        <strong>Note:</strong> This is a frontend-only learning simulation. No
        real SQL is executed.
      </div>
    </div>
  );
}
