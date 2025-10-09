import React, { useMemo, useState } from "react";
import { phishingEmails } from "./phishingUtils";

/*
  Single-email PhishingGame:
  - One email displayed per load
  - User classifies as Phishing or Not Phishing
  - Shows explanation after selection
*/

export default function PhishingGame() {
  // pick a single random email at load
  const email = useMemo(() => {
    const idx = Math.floor(Math.random() * phishingEmails.length);
    return phishingEmails[idx];
  }, []);

  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null); // true = phishing, false = not

  if (!email) return null;

  function handleAnswer(isPhish) {
    setUserAnswer(isPhish);
    setAnswered(true);
  }

  function reload() {
    window.location.reload(); // simple way to get a new email
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-lg md:max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-3">📧 Phishing Classification</h2>

      <div className="border border-slate-100 rounded-lg p-4 mb-4 bg-slate-100">
        <div className="mb-2">
          <div className="text-sm text-slate-500">From</div>
          <div className="font-medium">{email.from}</div>
        </div>

        <div className="mb-2">
          <div className="text-sm text-slate-500">Subject</div>
          <div className="font-medium">{email.subject}</div>
        </div>

        <div className="mt-3  bg-white rounded text-sm leading-relaxed whitespace-pre-wrap">
          {email.body}
        </div>
      </div>

      {!answered ? (
        <div className="flex gap-3 justify-center mb-3">
          <button
            onClick={() => handleAnswer(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Phishing
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Not Phishing
          </button>
        </div>
      ) : (
        <div className="mt-4 p-3 border rounded bg-slate-50">
          <p
            className={`font-semibold mb-2 ${
              userAnswer === email.isPhishing
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {userAnswer === email.isPhishing ? "✅ Correct!" : "❌ Incorrect"}
          </p>
          <div className="text-sm text-slate-700">
            <strong>Explanation:</strong> {email.hint}
          </div>
          <button
            onClick={reload}
            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Try Another Email
          </button>
        </div>
      )}
    </div>
  );
}
