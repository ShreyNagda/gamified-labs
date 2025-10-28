# Gamified Cybersecurity Training Platform

## 🧠 Overview

This project is a **web-based gamified cybersecurity training platform** built to enhance learning through interactive challenges and simulated attack scenarios.  
It aims to improve awareness and practical understanding of cybersecurity concepts such as **SQL Injection, XSS, Encryption, Password Security, and Phishing Detection**.

Users learn through **hands-on practice**, earning points, unlocking levels, and receiving immediate feedback — transforming cybersecurity education into an engaging, game-like experience.

---

## ⚙️ Architecture

### Frontend

- **Framework:** React.js for responsive and dynamic UI
- **State Management:** React Hooks and `localStorage` for persistent progress
- **UI Components:**
  - Sidebar Navigation (Mini-games and Challenge Mode)
  - Mini-Game Modules (SQL Injection, XSS, Encryption, Password Attack, Phishing)
  - Scoreboard & Leaderboard
  - Safe/Unsafe Mode Toggles
  - Challenge Mode for sequential gameplay with scoring and hints

### Backend (Optional)

- **Server:** Node.js / Express (or Flask)
- **Database:** MongoDB / SQLite for saving user scores and progress
- **Authentication:** Optional user login system for progress tracking

---

## 🕹️ Modules

| Module                 | Description                                                                    |
| ---------------------- | ------------------------------------------------------------------------------ |
| **SQL Injection**      | Simulated login form to demonstrate and prevent injection vulnerabilities.     |
| **XSS Simulation**     | Teaches how user inputs can execute scripts and how to sanitize inputs.        |
| **Encryption Game**    | Simple Caesar cipher challenges to teach encryption/decryption basics.         |
| **Password Attack**    | Demonstrates a dictionary-based brute force attack simulation.                 |
| **Phishing Detection** | Interactive email classification activity that highlights phishing indicators. |

---

## 🧩 Features

- **Gamified learning** through points, hints, and level progression
- **Adaptive difficulty** for replayable challenges
- **Persistent progress** via browser storage
- **Optional leaderboard** for competitive motivation
- **Safe sandbox environment** to simulate real-world attacks and defenses

---

## 🚀 How to Run

### Frontend

```bash
# Clone the repository
git clone https://github.com/yourusername/gamified-cybersecurity-lab.git
cd gamified-cybersecurity-lab

# Install dependencies
npm install

# Run development server
npm start
```
