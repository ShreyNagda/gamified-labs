import React, { useState } from "react";
import CryptoJS from "crypto-js";

export default function EncryptionGame() {
  const [text, setText] = useState("");
  const [method, setMethod] = useState("caesar");
  const [output, setOutput] = useState("");
  const [hint, setHint] = useState("");
  const [key, setKey] = useState(3); // Caesar cipher key

  // ----- Encryption & Decryption Logic -----
  const encryptCaesar = (str, shift = 3) =>
    str.replace(/[a-z]/gi, (c) => {
      const base = c === c.toUpperCase() ? 65 : 97;
      return String.fromCharCode(
        ((c.charCodeAt(0) - base + shift) % 26) + base
      );
    });

  const decryptCaesar = (str, shift = 3) => encryptCaesar(str, 26 - shift);

  const encryptAES = (text) =>
    CryptoJS.AES.encrypt(text, "secretkey123").toString();
  const decryptAES = (cipher) =>
    CryptoJS.AES.decrypt(cipher, "secretkey123").toString(CryptoJS.enc.Utf8);

  const encryptDES = (text) =>
    CryptoJS.DES.encrypt(text, "secretkey123").toString();
  const decryptDES = (cipher) =>
    CryptoJS.DES.decrypt(cipher, "secretkey123").toString(CryptoJS.enc.Utf8);

  const encryptSHA = (text) => CryptoJS.SHA256(text).toString();
  const encryptMD5 = (text) => CryptoJS.MD5(text).toString();

  // ----- Handle Encryption -----
  const handleEncrypt = () => {
    switch (method) {
      case "caesar":
        setOutput(encryptCaesar(text, parseInt(key) || 3));
        break;
      case "aes":
        setOutput(encryptAES(text));
        break;
      case "des":
        setOutput(encryptDES(text));
        break;
      case "sha":
        setOutput(encryptSHA(text));
        break;
      case "md5":
        setOutput(encryptMD5(text));
        break;
      default:
        setOutput("");
    }
  };

  // ----- Handle Decryption -----
  const handleDecrypt = () => {
    switch (method) {
      case "caesar":
        setOutput(decryptCaesar(text, parseInt(key) || 3));
        break;
      case "aes":
        setOutput(decryptAES(text));
        break;
      case "des":
        setOutput(decryptDES(text));
        break;
      case "sha":
      case "md5":
        setOutput("⚠️ These algorithms are one-way — cannot be decrypted!");
        break;
      default:
        setOutput("");
    }
  };

  // ----- Show Hint -----
  const showHint = () => {
    const hints = {
      caesar:
        "Caesar Cipher shifts each letter by a numeric key. Example: key=3 shifts A→D.",
      aes: "AES uses a secret key — the same key decrypts what it encrypts.",
      des: "DES is an older symmetric encryption algorithm similar to AES.",
      sha: "SHA is a one-way hash function — it can't be reversed, only verified.",
      md5: "MD5 is a hashing algorithm, not encryption — it cannot be decrypted.",
    };
    setHint(hints[method]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-lg md:max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        🔐 Data Encryption Game
      </h2>

      {/* Method Selector */}
      <select
        value={method}
        onChange={(e) => {
          setMethod(e.target.value);
          setHint("");
          setOutput("");
        }}
        className="border border-blue-300 rounded-lg p-2 w-full mb-3"
      >
        <option value="caesar">Caesar Cipher</option>
        <option value="aes">AES (Advanced Encryption Standard)</option>
        <option value="des">DES (Data Encryption Standard)</option>
        <option value="sha">SHA-256 Hash</option>
        <option value="md5">MD5 Hash</option>
      </select>

      {/* Key Field for Caesar Cipher */}
      {method === "caesar" && (
        <input
          type="number"
          className="w-full border border-blue-300 rounded-lg p-2 mb-3"
          placeholder="Enter shift key (e.g., 3)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      )}

      {/* Input Box */}
      <textarea
        className="w-full border border-blue-300 rounded-lg p-2 mb-3"
        rows="3"
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleEncrypt}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:"
        >
          Encrypt
        </button>
        <button
          onClick={handleDecrypt}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200"
        >
          Decrypt
        </button>
        <button
          onClick={showHint}
          className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200"
        >
          Hint
        </button>
      </div>

      {/* Output */}
      <p className="mt-4 break-all border-t pt-3 text-sm text-gray-700">
        <strong>Result:</strong> {output || "—"}
      </p>

      {/* Hint Section */}
      {hint && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
          💡 <strong>Hint:</strong> {hint}
        </div>
      )}
    </div>
  );
}
