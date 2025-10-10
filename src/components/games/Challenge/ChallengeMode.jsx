// src/ChallengeMode.jsx
import React, { useEffect, useState } from "react";
import { phishingEmails } from "../Phishing/phishingUtils";

/*
  ChallengeMode (updated)
  - Level 1: SQL Injection (uses an in-component SQL simulation inspired by SQLInjectionGame)
  - Level 2: XSS (unsafe/safe toggle + hint)
  - Level 3: Encryption (Caesar) — key randomized each reload, hint available
  - Level 4: Password Attack (dictionary simulation) — hint available
  - Level 5: Phishing classification — hint & explanation shown
  - Each level has a Hint button and shows alert() when solved
*/

export default function ChallengeMode() {
  // Config
  const CONFIG = {
    attemptsLimit: 6,
    hintPenaltyPercent: 15,
    points: { 1: 100, 2: 150, 3: 200, 4: 250, 5: 300 },
  };

  // Secrets / sample data (frontend-only)
  const SECRETS = {
    username: "player_one",
    sqlToken: "SIM_SQL_TOKEN_L2_7x9",
    password: "S3cPa$$_L2",
    level3Plaintext: "Rainbow42!",
    recoveryKey: "RECOVERY_KEY_4_F1",
    finalFlag: "FINALFLAG{defense_in_depth_wins}",
  };

  // small dictionary for level 4 (teaching)
  const commonPasswords = [
    "123456",
    "password",
    "123456789",
    "12345678",
    "12345",
    "qwerty",
    "abc123",
    "password123",
    "letmein",
    "welcome",
    "admin",
  ];

  // phishing sample for level 5
  // safe one-liner (call inside your component)
  const phishingSample =
    phishingEmails[Math.floor(Math.random() * phishingEmails.length)];

  // component state
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(
    "Challenge Mode — follow hints or solve each level."
  );
  const [attempts, setAttempts] = useState({});
  const [hintsUsed, setHintsUsed] = useState(0);

  // Level-specific states

  // --- Level 1: SQL Injection (robust detection, unsafe/safe toggle)
  const [unsafeQuery, setUnsafeQuery] = useState(false); // true = vulnerable
  const [sqlUsername, setSqlUsername] = useState("");
  const [sqlPassword, setSqlPassword] = useState(""); // optional, not used for injection detection
  const [sqlResult, setSqlResult] = useState("");
  const [sqlHintVisible, setSqlHintVisible] = useState(false);

  // --- Level 2: XSS
  const [unsafeXSS, setUnsafeXSS] = useState(false);
  const [xssInput, setXssInput] = useState("");
  const [xssOutput, setXssOutput] = useState("");
  const [xssHintVisible, setXssHintVisible] = useState(false);

  // --- Level 3: Encryption (random key each reload)
  const [caesarKey, setCaesarKey] = useState(
    () => Math.floor(Math.random() * 25) + 1
  );
  const [l3Input, setL3Input] = useState("");
  const [l3Cipher, setL3Cipher] = useState("");
  const [l3HintVisible, setL3HintVisible] = useState(false);

  // --- Level 4: Password Attack
  //   const [l4Target, setL4Target] = useState("password123");
  const [l4Progress, setL4Progress] = useState("");
  const [l4Running, setL4Running] = useState(false);
  const [l4HintVisible, setL4HintVisible] = useState(false);

  // --- Level 5: Phishing
  const [l5Choice, setL5Choice] = useState(null);
  const [l5HintVisible, setL5HintVisible] = useState(false);

  useEffect(() => {
    // Load saved progress on mount
    const saved = localStorage.getItem("cyberArenaChallenge");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.level) setLevel(data.level);
        if (data.score) setScore(data.score);
        if (data.hintsUsed) setHintsUsed(data.hintsUsed);
        if (data.attempts) setAttempts(data.attempts);
        if (data.caesarKey) setCaesarKey(data.caesarKey);
        setMessage("🔄 Progress loaded from previous session.");
      } catch (e) {
        console.error("Failed to load saved challenge:", e);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      level,
      score,
      hintsUsed,
      attempts,
      caesarKey,
    };
    localStorage.setItem("cyberArenaChallenge", JSON.stringify(data));
  }, [level, score, hintsUsed, attempts, caesarKey]);

  // helper: increment attempt count
  function addAttempt(k) {
    setAttempts((prev) => ({ ...prev, [k]: (prev[k] || 0) + 1 }));
  }

  // helper: deduct hint penalty
  function buyHint() {
    setHintsUsed((h) => h + 1);
    const penalty = Math.max(
      1,
      Math.round(score * (CONFIG.hintPenaltyPercent / 100))
    );
    setScore((s) => Math.max(0, s - penalty));
    setMessage(
      `Hint purchased (-${penalty}). See the hint for this level below.`
    );
  }

  // Utility: improved injection detector (loose matching)
  function isInjectionPayload(str) {
    if (!str) return false;
    const s = String(str).toLowerCase().replace(/\s+/g, " ");
    const patterns = [
      /'\s*or\s*'?\s*1\s*'?\s*=\s*'?\s*1/, // ' OR '1'='1 variations
      /\bor\s+1\s*=\s*1\b/, // OR 1=1
      /--/, // comment marker
      /\bunion\b/, // union keyword
      /;/,
    ];
    return patterns.some((re) => re.test(s));
  }

  // Utility: show simulated unsafe / safe query strings
  function simulatedQuery(u, p) {
    return `SELECT * FROM users WHERE username = '${u}' AND password = '${p}';`;
  }

  // LEVEL 1 handler (SQL)
  function submitSQL() {
    addAttempt("l1");
    const injDetected =
      isInjectionPayload(sqlUsername) || isInjectionPayload(sqlPassword);
    if (unsafeQuery) {
      if (injDetected || sqlUsername.trim() === SECRETS.sqlToken) {
        setSqlResult(
          `⚠️ Injection successful (simulated). Password revealed: ${SECRETS.password}`
        );
        setScore((s) => s + CONFIG.points[1]);
        alert("✅ Level 1 complete — SQL injection success!");
        setMessage("Password retrieved — proceed to Level 2.");
        // store password to state for final check
        // use sqlPassword state to hold revealed password
        setSqlPassword(SECRETS.password);
        setTimeout(() => setLevel(2), 400);
        return;
      } else {
        setSqlResult(
          "No rows returned. Try common payloads or the known token."
        );
      }
    } else {
      // safe mode: block suspicious inputs
      if (injDetected) {
        setSqlResult("🛡️ Safe mode prevented suspicious input (simulated).");
      } else {
        setSqlResult("🔎 Safe query executed — nothing sensitive returned.");
      }
    }
  }

  // LEVEL 2 handler (XSS)
  function submitXSS() {
    addAttempt("l2");
    const hasScript =
      /<script[\s\S]*?>/i.test(xssInput) || /onerror\s*=/i.test(xssInput);
    if (unsafeXSS) {
      if (hasScript) {
        // simulate "execution" by revealing the next secret (we'll just progress)
        setXssOutput(
          "⚠️ XSS simulated — secret revealed: (simulated payload success)"
        );
        setScore((s) => s + CONFIG.points[2]);
        alert("✅ Level 2 complete — XSS triggered!");
        setMessage("XSS triggered — proceed to Level 3.");
        setTimeout(() => setLevel(3), 400);
      } else {
        setXssOutput(
          "No active payload detected. Try using <script> or an onerror payload."
        );
      }
    } else {
      if (hasScript) {
        setXssOutput("🛡️ Safe mode blocked the script.");
      } else {
        setXssOutput("Input looks safe.");
      }
    }
  }

  // LEVEL 3: Caesar encryption check
  // compute ciphertext for sample plaintext (we'll use SECRETS.level3Plaintext as read-only example)
  function caesarEncrypt(str, shift) {
    return String(str).replace(/[a-z]/gi, function (c) {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(
        ((c.charCodeAt(0) - base + shift) % 26) + base
      );
    });
  }

  useEffect(() => {
    // prepare ciphertext for the sample (so player can decrypt or be asked to encrypt)
    setL3Cipher(caesarEncrypt(SECRETS.level3Plaintext, caesarKey));
  }, [caesarKey, SECRETS.level3Plaintext]);

  async function submitLevel3() {
    addAttempt("l3");
    // In this challenge we ask them to supply the plaintext that produces the known hash OR
    // we can ask to encrypt "HELLO" with caesarKey. To keep consistent with previous flows:
    // Accept if user types the correct plaintext for the known ciphertext (i.e., they decrypted correctly)
    if (
      l3Input.trim().toLowerCase() === SECRETS.level3Plaintext.toLowerCase()
    ) {
      setScore((s) => s + CONFIG.points[3]);
      alert("✅ Level 3 complete — decrypted successfully!");
      setMessage("Correct — proceed to Level 4.");
      setTimeout(() => setLevel(4), 400);
    } else {
      setMessage(
        "Not correct. Hint available — try reversing the Caesar shift."
      );
    }
  }

  // LEVEL 4: dictionary attack simulation
  async function startLevel4Attack() {
    if (l4Running) return;
    setL4Running(true);
    setL4Progress("Starting dictionary attack...");
    for (let i = 0; i < commonPasswords.length; i++) {
      const attempt = commonPasswords[i];
      setL4Progress(
        `Trying "${attempt}" (${i + 1}/${commonPasswords.length})...`
      );
      // small delay for simulation
      await new Promise((r) => setTimeout(r, 160));
      if (attempt === SECRETS.password || attempt === "password123") {
        // note: our SECRETS.password is S3cPa$$_L2 which won't be in small list.
        // For a success demo we accept password123 as well if target set that way.
        setL4Progress(`Cracked: ${attempt}`);
        setScore((s) => s + CONFIG.points[4]);
        setL4Running(false);
        alert("✅ Level 4 complete — password cracked!");
        setMessage("Password found — proceed to Level 5.");
        setTimeout(() => setLevel(5), 400);
        return;
      }
    }
    setL4Progress("Not found in dictionary.");
    setL4Running(false);
    setMessage("Attack finished — password not in this small dictionary.");
  }

  // LEVEL 5: phishing classification
  function submitLevel5(choiceIsPhishing) {
    addAttempt("l5");
    const correct = choiceIsPhishing === phishingSample.isPhishing;
    if (correct) {
      setScore((s) => s + CONFIG.points[5]);
      alert("🏁 Final level passed — you found the treasure!");
      setMessage("Correct classification — final treasure unlocked.");
      // show final flag (in real app you'd only show after final checks)
      setTimeout(() => setLevel(6), 300);
    } else {
      setMessage("Incorrect classification — review the hints and try again.");
    }
    setL5Choice(choiceIsPhishing);
  }

  // Render per-level UI + hint buttons
  return (
    <div className="bg-blue-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              Challenge Mode — Level {level <= 5 ? level : "Complete"}
            </h1>
            <div className="text-sm text-slate-600">
              Score: <strong>{score}</strong>
            </div>
          </div>

          <div className="mb-4 text-sm text-slate-700">{message}</div>

          {/* Level content */}
          <div className="space-y-6">
            {/* Level 1: SQL Injection */}
            {level === 1 && (
              <section>
                <h2 className="font-semibold">
                  Level 1 — SQL Injection (Simulated)
                </h2>
                <p className="text-xs text-slate-600">
                  Use the Unsafe/ Safe toggle and try inputting a payload or a
                  token to retrieve the password (simulated).
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={unsafeQuery ? "text-red-600" : "text-gray-400"}
                  >
                    Unsafe Query
                  </span>
                  <div
                    role="button"
                    aria-pressed={unsafeQuery}
                    onClick={() => setUnsafeQuery((v) => !v)}
                    className={`w-14 h-7 flex items-center rounded-full cursor-pointer ${
                      unsafeQuery ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
                        unsafeQuery ? "translate-x-1" : "translate-x-7"
                      }`}
                    />
                  </div>
                  <span
                    className={
                      !unsafeQuery ? "text-green-600" : "text-gray-400"
                    }
                  >
                    Safe Query
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <input
                    value={sqlUsername}
                    onChange={(e) => setSqlUsername(e.target.value)}
                    placeholder="Username or injection payload"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    value={sqlPassword}
                    onChange={(e) => setSqlPassword(e.target.value)}
                    placeholder="Password (optional)"
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="mt-3 flex gap-3">
                  <button
                    onClick={submitSQL}
                    className="bg-emerald-600 text-white px-3 py-2 rounded"
                  >
                    Run
                  </button>
                  <button
                    onClick={() => {
                      setSqlResult(
                        `Simulated query: ${simulatedQuery(
                          sqlUsername || "<username>",
                          sqlPassword || "<password>"
                        )}`
                      );
                    }}
                    className="bg-slate-100 px-3 py-2 rounded"
                  >
                    Show Query
                  </button>
                  <button
                    onClick={() => {
                      setSqlHintVisible((v) => !v);
                      buyHint();
                    }}
                    className="bg-yellow-100 px-3 py-2 rounded"
                  >
                    Hint
                  </button>
                </div>

                {sqlHintVisible && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>SQL Hint:</strong>
                    <ul className="list-disc ml-5 mt-2 text-slate-700">
                      <li>
                        Try payloads like <code>' OR '1'='1</code> or{" "}
                        <code>--</code> to comment out the remainder.
                      </li>
                      <li>
                        Or paste the known token:{" "}
                        <code>{SECRETS.sqlToken}</code>.
                      </li>
                      <li>
                        Unsafe Query allows concatenated input to succeed
                        (simulated).
                      </li>
                    </ul>
                  </div>
                )}

                {sqlResult && (
                  <div className="mt-3 p-2 rounded bg-slate-50 text-sm">
                    {sqlResult}
                  </div>
                )}
              </section>
            )}

            {/* Level 2: XSS */}
            {level === 2 && (
              <section>
                <h2 className="font-semibold">Level 2 — XSS Simulation</h2>
                <p className="text-xs text-slate-600">
                  Toggle Unsafe to allow scripts to execute (simulated). Try
                  inputting a small script payload.
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={unsafeXSS ? "text-red-600" : "text-gray-400"}
                  >
                    Unsafe Mode
                  </span>
                  <div
                    role="button"
                    aria-pressed={unsafeXSS}
                    onClick={() => setUnsafeXSS((v) => !v)}
                    className={`w-14 h-7 flex items-center rounded-full cursor-pointer ${
                      unsafeXSS ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow transform ${
                        unsafeXSS ? "translate-x-1" : "translate-x-7"
                      }`}
                    />
                  </div>
                  <span
                    className={!unsafeXSS ? "text-green-600" : "text-gray-400"}
                  >
                    Safe Mode
                  </span>
                </div>

                <input
                  value={xssInput}
                  onChange={(e) => setXssInput(e.target.value)}
                  placeholder='Try: <script>alert("XSS")</script> or <img src=x onerror=alert(1)>'
                  className="w-full border p-2 rounded mt-3"
                />

                <div className="mt-3 flex gap-3">
                  <button
                    onClick={submitXSS}
                    className="bg-emerald-600 text-white px-3 py-2 rounded"
                  >
                    Execute
                  </button>
                  <button
                    onClick={() => {
                      setXssHintVisible((v) => !v);
                      buyHint();
                    }}
                    className="bg-yellow-100 px-3 py-2 rounded"
                  >
                    Hint
                  </button>
                </div>

                {xssHintVisible && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>XSS Hints:</strong>
                    <ul className="list-disc ml-5 mt-2 text-slate-700">
                      <li>
                        Try a &lt;script&gt; tag or an element with an{" "}
                        <code>onerror</code> handler.
                      </li>
                      <li>
                        Unsafe mode simulates rendering your input as HTML.
                      </li>
                    </ul>
                  </div>
                )}

                {xssOutput && (
                  <div className="mt-3 p-2 rounded bg-slate-50 text-sm">
                    {xssOutput}
                  </div>
                )}
              </section>
            )}

            {/* Level 3: Encryption (Caesar) */}
            {level === 3 && (
              <section>
                <h2 className="font-semibold">Level 3 — Decrypt the Cipher</h2>
                <p className="text-xs text-slate-600">
                  A secret phrase has been Caesar-shifted. Decrypt it (key
                  randomized each load).
                </p>

                <p className="mt-2 text-xs">
                  Ciphertext:{" "}
                  <code className="bg-slate-100 p-1 rounded">{l3Cipher}</code>{" "}
                  (shift = <strong>{caesarKey}</strong>)
                </p>

                <input
                  value={l3Input}
                  onChange={(e) => setL3Input(e.target.value)}
                  placeholder="Enter decrypted plaintext"
                  className="w-full border p-2 rounded mt-3"
                />

                <div className="mt-3 flex gap-3">
                  <button
                    onClick={submitLevel3}
                    className="bg-emerald-600 text-white px-3 py-2 rounded"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setL3HintVisible((v) => !v);
                      buyHint();
                    }}
                    className="bg-yellow-100 px-3 py-2 rounded"
                  >
                    Hint
                  </button>
                  <button
                    onClick={() => {
                      const sample = caesarEncrypt(
                        SECRETS.level3Plaintext,
                        caesarKey
                      );
                      setMessage(
                        `(Demo) ciphertext of secret using key: ${sample}`
                      );
                    }}
                    className="bg-slate-100 px-3 py-2 rounded"
                  >
                    Demo
                  </button>
                </div>

                {l3HintVisible && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>Caesar Hints:</strong>
                    <ul className="list-disc ml-5 mt-2 text-slate-700">
                      <li>Shift letters backwards by the key to decrypt.</li>
                      <li>Only letters are shifted; case is preserved.</li>
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Level 4: Password Attack */}
            {level === 4 && (
              <section>
                <h2 className="font-semibold">
                  Level 4 — Password Attack (dictionary)
                </h2>
                <p className="text-xs text-slate-600">
                  Simulated dictionary attack. Start the attack to try common
                  passwords.
                </p>

                <div className="mt-3 flex gap-3">
                  <button
                    onClick={startLevel4Attack}
                    disabled={l4Running}
                    className={`px-3 py-2 rounded text-white ${
                      l4Running ? "bg-slate-400" : "bg-emerald-600"
                    }`}
                  >
                    {l4Running ? "Attacking..." : "Start Attack"}
                  </button>
                  <button
                    onClick={() => {
                      setL4HintVisible((v) => !v);
                      buyHint();
                    }}
                    className="bg-yellow-100 px-3 py-2 rounded"
                  >
                    Hint
                  </button>
                </div>

                {l4Progress && (
                  <div className="mt-3 p-2 rounded bg-slate-50 text-sm">
                    {l4Progress}
                  </div>
                )}

                {l4HintVisible && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>Password Attack Hints:</strong>
                    <ul className="list-disc ml-5 mt-2 text-slate-700">
                      <li>
                        Common passwords like <code>password</code>,{" "}
                        <code>123456</code>, or <code>password123</code> are
                        often in dictionaries.
                      </li>
                      <li>Rate limiting and MFA mitigate such attacks.</li>
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Level 5: Phishing */}
            {level === 5 && (
              <section>
                <h2 className="font-semibold">
                  Level 5 — Phishing Classification
                </h2>
                <p className="text-xs text-slate-600">
                  Decide whether this email is phishing or not. A hint button
                  explains what to look for.
                </p>

                <div className="mt-3 border p-3 rounded bg-slate-50">
                  <div className="text-xs text-slate-500">From</div>
                  <div className="font-medium">{phishingEmails.from}</div>
                  <div className="text-xs text-slate-500 mt-2">Subject</div>
                  <div className="font-medium">{phishingSample.subject}</div>
                  <div className="mt-3 p-2 bg-white rounded text-sm whitespace-pre-wrap border">
                    {phishingSample.body}
                  </div>
                </div>

                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => submitLevel5(true)}
                    className="bg-red-600 text-white px-3 py-2 rounded"
                  >
                    Phishing
                  </button>
                  <button
                    onClick={() => submitLevel5(false)}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Not Phishing
                  </button>
                  <button
                    onClick={() => {
                      setL5HintVisible((v) => !v);
                      buyHint();
                    }}
                    className="bg-yellow-100 px-3 py-2 rounded"
                  >
                    Hint
                  </button>
                </div>

                {l5HintVisible && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>Phishing Hints:</strong>
                    <ul className="list-disc ml-5 mt-2 text-slate-700">
                      <li>
                        Look for subtle typos in domains (e.g.{" "}
                        <code>paypa1.com</code>), unexpected urgency, and
                        requests to click a link for sensitive info.
                      </li>
                      <li>
                        Contact the organization via their official site rather
                        than clicking email links.
                      </li>
                    </ul>
                  </div>
                )}

                {l5Choice !== null && (
                  <div className="mt-3 p-3 rounded bg-slate-50">
                    <div
                      className={`font-semibold ${
                        l5Choice === phishingSample.isPhishing
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {l5Choice === phishingSample.isPhishing
                        ? "✅ Correct"
                        : "❌ Incorrect"}
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      <strong>Why:</strong> {phishingSample.explanation}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Completed */}
            {level > 5 && (
              <section>
                <h2 className="font-semibold">🎉 All levels complete</h2>
                <p className="text-sm text-slate-700">
                  You completed the challenge — nice work!
                </p>
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded font-mono">
                  FLAG: {SECRETS.finalFlag}
                </div>
              </section>
            )}
          </div>

          {/* Controls bottom row */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={buyHint}
              className="bg-yellow-400 px-3 py-2 rounded text-white"
            >
              Buy Hint (-{CONFIG.hintPenaltyPercent}%)
            </button>
            <button
              onClick={() => {
                // reset current level inputs (soft reset)
                setMessage("Level reset.");
                setSqlUsername("");
                setSqlPassword("");
                setSqlResult("");
                setXssInput("");
                setXssOutput("");
                setL3Input("");
                setL3Cipher(caesarEncrypt(SECRETS.level3Plaintext, caesarKey));
                setL4Progress("");
                setL4Running(false);
                setL5Choice(null);
              }}
              className="bg-slate-100 px-3 py-2 rounded"
            >
              Reset Level
            </button>
            <button
              onClick={() => {
                // full restart
                localStorage.removeItem("cyberArenaChallenge");
                setLevel(1);
                setScore(0);
                setMessage("Challenge restarted");
                setAttempts({});
                setHintsUsed(0);
                setSqlUsername("");
                setSqlPassword("");
                setSqlResult("");
                setXssInput("");
                setXssOutput("");
                setL3Input("");
                setCaesarKey(Math.floor(Math.random() * 25) + 1);
                setL4Progress("");
                setL4Running(false);
                setL5Choice(null);
              }}
              className="bg-red-100 px-3 py-2 rounded"
            >
              Restart Challenge
            </button>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Attempts: L1 {attempts.l1 || 0} | L2 {attempts.l2 || 0} | L3{" "}
            {attempts.l3 || 0} | L4 {attempts.l4 || 0} | L5 {attempts.l5 || 0}
            <br />
            Hints used: <strong>{hintsUsed}</strong>
          </div>
        </div>
      </div>
    </div>
  );

  //   // caesar helper defined at bottom so level render can call it
  //   function caesarEncrypt(str, shift) {
  //     return String(str).replace(/[a-z]/gi, function (c) {
  //       const base = c <= "Z" ? 65 : 97;
  //       return String.fromCharCode(
  //         ((c.charCodeAt(0) - base + shift) % 26) + base
  //       );
  //     });
  //   }
}
