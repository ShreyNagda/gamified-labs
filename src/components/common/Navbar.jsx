import React, { useState, useEffect } from "react";
import {
  FaDatabase,
  FaShieldAlt,
  FaLock,
  FaKey,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarked,
} from "react-icons/fa";
export default function Sidebar({ active, setActive }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const tabs = [
    { key: "SQL", label: "SQL Injection", icon: FaDatabase },
    { key: "XSS", label: "XSS", icon: FaShieldAlt },
    { key: "ENC", label: "Encryption", icon: FaLock },
    { key: "PASS", label: "Password Attack", icon: FaKey },
    { key: "PHISHING", label: "Phishing", icon: FaEnvelope },
    { key: "CHALLENGE", label: "Challenge Mode", icon: FaMapMarked },
  ];

  // Handle responsive collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // mobile breakpoint
        setIsMobile(true);
        setCollapsed(true); // collapse by default on mobile
      } else {
        setIsMobile(false);
        setCollapsed(false); // expanded by default on larger screens
      }
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`bg-white shadow p-4 transition-all duration-300
                     ${collapsed ? "w-16" : "w-56"} flex flex-col`}
    >
      {/* Collapse toggle (hide on mobile) */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-6 p-2 rounded hover:bg-slate-100 self-end text-sm"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      )}

      <nav className="flex flex-col gap-2 h-screen">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center gap-3 p-2 rounded transition-colors
                        ${
                          active === t.key
                            ? "bg-blue-100 text-blue-600"
                            : "text-slate-700"
                        }
                        hover:bg-slate-100`}
            >
              <Icon className="w-6 h-6" />
              {!collapsed && (
                <span className="font-semibold truncate">{t.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
