# 🧠 NeuroBridge AI

**NeuroBridge AI** is a web-based assistive learning tool designed to support **neurodiverse students** (ADHD, Autism, learning differences) by providing calm, adaptive, and privacy-first learning support.

Built for **Imagine Cup 2026**.

---

## 🌟 Problem

Many neurodiverse students struggle with:
- Cognitive overload from dense study material
- Difficulty maintaining focus for long periods
- Lack of personalized learning support
- Tools that feel intrusive or overwhelming

Most existing solutions focus on productivity — not **cognitive accessibility**.

---

## 💡 Solution

NeuroBridge AI acts as a **gentle digital learning companion** that:

- Simplifies complex study notes into calm, readable bullet points
- Uses **real-time on-device focus detection** (camera-based)
- Suggests **micro-breaks** instead of forcing productivity
- Gives users full control (camera on/off, dark mode, font size)
- Works entirely on the **web**, with no accounts required

---

## ✨ Key Features

### 📝 AI-Powered Note Simplification
- Converts long study notes into easy-to-read bullet points
- Uses a **free generative AI API (Google Gemini)** for real-time processing
- Calm language tailored for neurodiverse learners

### 📷 Privacy-First Focus Detection
- Uses **MediaPipe Face Detection**
- Runs fully **on-device**
- No video storage, no uploads, no identity detection
- Camera can be turned ON/OFF at any time

### 🌱 Micro-Break System
- Detects prolonged focus loss
- Suggests short, optional breaks
- Includes a gentle break timer
- No alarms, no forced interruptions

### ♿ Accessibility-First Design
- Dark mode
- Adjustable font size
- Reduced motion support
- Clean, low-stimulation UI

---

## 🛡️ Privacy & Ethics

NeuroBridge AI is built with **ethical AI principles**:

- ❌ No accounts required
- ❌ No personal data stored
- ❌ No video or audio recorded
- ✅ All camera processing is local
- ✅ User consent is required for camera access

> This project prioritizes **support over surveillance**.

---

## 🧰 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **AI:** Google Gemini API (free tier)
- **Computer Vision:** MediaPipe Face Detection
- **Hosting:** GitHub Pages
- **Storage:** Browser localStorage (settings only)

---

## 🚀 Live Demo

🔗 **Live Website:**  
https://frhnkhn.github.io/neurobridge-web/

> ⚠️ Note: Camera features require HTTPS (works on GitHub Pages).

---

## 🧪 Running Locally

```bash
cd neurobridge-web
python3 -m http.server 8000
