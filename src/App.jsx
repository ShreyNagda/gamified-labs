import React from "react";
import Navbar from "./components/common/Navbar";
import SQLInjectionGame from "./components/games/SQLInjection/SQLInjectionGame";
import XSSGame from "./components/games/XSS/XSSGame";
import EncryptionGame from "./components/games/Encryption/EncryptionGame";
import PasswordAttackGame from "./components/games/PasswordAttack/PasswordAttackGame";
import PhishingGame from "./components/games/Phishing/PhishingGame";
export default function App() {
  const [active, setActive] = React.useState("SQL");
  const renderGame = () => {
    switch (active) {
      case "SQL":
        return <SQLInjectionGame />;
      case "XSS":
        return <XSSGame />;
      case "ENC":
        return <EncryptionGame />;
      case "PASS":
        return <PasswordAttackGame />;
      case "PHISHING":
        return <PhishingGame />;
      default:
        return <SQLInjectionGame />;
    }
  };
  return (
    <>
      <div className="h-screen bg-blue-50 text-gray-800">
        <div className="flex ">
          <Navbar active={active} setActive={setActive} />
          <div className="max-w-4xl mx-auto mt-8 p-4">
            <div className="flex gap-1 items-center p-4">
              <div className="text-xl font-bold">CyberArena</div>
              <div className="text-xl hidden md:block">
                : Hands-on Security Practice Games
              </div>
            </div>
            <div className="max-w-2xl">{renderGame()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
