import React, { useState, useRef } from "react";
import { commonPasswords } from "./passwordUtils";

/*
  PasswordAttackGame (frontend-only simulation)
  - Simulates a dictionary attack against a supplied target password.
  - Safe: no network, no real password cracking, just array check + simulated timing.
*/

export default function PasswordAttackGame() {
  const [target, setTarget] = useState("password123");
  const [result, setResult] = useState("");
  const [hint, setHint] = useState("");
  const [running, setRunning] = useState(false);
  const [progressText, setProgressText] = useState("");
  const cancelRef = useRef(false);

  // Simulated attacker speed (ms per attempt). Increase for longer demo.
  const ATTEMPT_DELAY = 120;

  // Run the simulated dictionary attack (async loop simulated with setTimeout)
  const handleAttack = async () => {
    if (running) return; // avoid double runs
    setResult("");
    setHint("");
    setRunning(true);
    cancelRef.current = false;
    setProgressText("Starting dictionary attack...");

    // Lowercase compare for typical weak-password checks (adjust if you want exact)
    const targetNormalized = String(target || "").trim();

    // Simulate sequential attempts with a short delay to show progress/animation
    for (let i = 0; i < commonPasswords.length; i++) {
      if (cancelRef.current) {
        setProgressText("Attack cancelled.");
        setRunning(false);
        return;
      }

      const tryPwd = commonPasswords[i];
      setProgressText(
        `Trying "${tryPwd}" (${i + 1}/${commonPasswords.length})...`
      );

      // await small delay to simulate work
      await new Promise((res) => setTimeout(res, ATTEMPT_DELAY));

      if (tryPwd === targetNormalized) {
        setResult(`✅ Password cracked: ${tryPwd}`);
        setProgressText(`Cracked after ${i + 1} attempts.`);
        setRunning(false);
        return;
      }
    }

    // not found
    setResult("❌ Password not found in dictionary");
    setProgressText(`Tried ${commonPasswords.length} common passwords.`);
    setRunning(false);
  };

  const cancelAttack = () => {
    cancelRef.current = true;
  };

  const showHint = () => {
    setHint(
      "💡 Dictionary attack simulation:\n\n" +
        "This demo sequentially tries common/weak passwords from a list (dictionary). " +
        "If the target exactly matches an entry in the list it is 'cracked' (simulated).\n\n" +
        "Useful test inputs: 'password', '123456', 'password123'.\n\n" +
        "Defenses: use strong, unique passwords; enforce length & complexity; rate-limit login attempts; and require multi-factor authentication (MFA)."
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-lg md:max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-3 text-center">
        🔓 Password Attack Simulation
      </h2>

      <p className="text-sm text-slate-600 mb-3">
        Simulating a dictionary attack using a predefined list of common
        passwords. (Frontend-only and safe — no network calls or real cracking.)
      </p>

      <label className="block text-sm font-medium text-slate-700 mb-1">
        Target password
      </label>
      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter password to test (e.g. password123)"
        className="w-full border border-blue-200 rounded-lg p-2 mb-3"
      />

      <div className="flex gap-3 justify-center">
        <button
          onClick={handleAttack}
          disabled={running}
          className={`px-4 py-2 rounded-lg text-white ${
            running
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {running ? "Attacking..." : "Start Attack"}
        </button>

        <button
          onClick={cancelAttack}
          disabled={!running}
          className={`px-4 py-2 rounded-lg ${
            running
              ? "bg-red-100 text-red-800 hover:bg-red-200"
              : "bg-gray-100 text-slate-600 cursor-not-allowed"
          }`}
        >
          Cancel
        </button>

        <button
          onClick={showHint}
          className="px-4 py-2 rounded-lg bg-green-100 text-green-800 hover:bg-green-200"
        >
          Hint
        </button>
      </div>

      {/* Progress + result */}
      {progressText && (
        <div className="mt-4 p-3 rounded bg-slate-50 border text-sm text-slate-700">
          {progressText}
        </div>
      )}

      {result && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            result.includes("cracked")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {result}
        </div>
      )}

      {/* Hint block */}
      {hint && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm whitespace-pre-wrap">
          {hint}
        </div>
      )}

      <div className="mt-4 text-xs text-slate-500 text-center">
        <strong>Note:</strong> This is an educational simulation only. It does
        not perform network attacks or breach any systems.
      </div>
    </div>
  );
}
