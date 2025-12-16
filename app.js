/* ================= CONFIG ================= */
const GEMINI_API_KEY = "AIzaSyB0c3_J6PRYLIMt0iHo00VKd8pS3S5wMxE";

/* ================= GLOBAL STATE ================= */
let currentFontSize = 16;
let lastFaceTime = Date.now();
let cameraEnabled = true;
let streamRef = null;

let breakInterval = null;
let breakSeconds = 120;
let onBreak = false;

/* ================= LOAD ================= */
window.onload = () => {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    }
    if (localStorage.getItem("fontSize")) {
        currentFontSize = parseInt(localStorage.getItem("fontSize"));
        document.body.style.fontSize = currentFontSize + "px";
    }
    startFaceDetection();
};

/* ================= ACCESSIBILITY ================= */
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

function increaseFont() {
    currentFontSize += 2;
    document.body.style.fontSize = currentFontSize + "px";
    localStorage.setItem("fontSize", currentFontSize);
}

function decreaseFont() {
    currentFontSize = Math.max(12, currentFontSize - 2);
    document.body.style.fontSize = currentFontSize + "px";
    localStorage.setItem("fontSize", currentFontSize);
}

/* ================= NOTES SIMPLIFIER ================= */
async function simplifyText() {
    const text = document.getElementById("inputText").value;
    const output = document.getElementById("output");
    const mode = document.getElementById("mode").value;

    if (!text.trim()) {
        output.innerHTML = "Please paste some notes 🙂";
        return;
    }

    if (mode === "simple") {
        const sentences = text.split(".").filter(s => s.trim());
        output.innerHTML =
            "<ul>" +
            sentences.map(s => `<li>${s.trim()}</li>`).join("") +
            "</ul>";
        return;
    }

    output.innerHTML = "🤖 Simplifying with AI...";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text:
                                "Simplify these study notes for a neurodiverse student using calm bullet points:\n\n" +
                                text
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;

        output.innerHTML =
            "<ul>" +
            aiText
                .split("\n")
                .filter(line => line.trim())
                .map(line => `<li>${line.replace(/^[-•]/, "").trim()}</li>`)
                .join("") +
            "</ul>";

    } catch (err) {
        output.innerHTML = "❌ AI error. Run using localhost or GitHub Pages.";
        console.error(err);
    }
}

/* ================= CAMERA CONTROL ================= */
function toggleCamera() {
    const btn = document.getElementById("cameraToggle");
    const statusText = document.getElementById("focusStatus");

    if (cameraEnabled) {
        if (streamRef) {
            streamRef.getTracks().forEach(t => t.stop());
        }
        cameraEnabled = false;
        btn.textContent = "Turn Camera On";
        statusText.textContent = "Focus camera is off 🌙";
        statusText.style.color = "#888";
    } else {
        cameraEnabled = true;
        btn.textContent = "Turn Camera Off";
        startFaceDetection();
    }
}

/* ================= FACE DETECTION ================= */
function startFaceDetection() {
    if (!cameraEnabled) return;

    const video = document.getElementById("video");
    const statusText = document.getElementById("focusStatus");

    const faceDetection = new FaceDetection({
        locateFile: file =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
    });

    faceDetection.setOptions({
        model: "short",
        minDetectionConfidence: 0.6
    });

    faceDetection.onResults(results => {
        if (results.detections && results.detections.length > 0) {
            lastFaceTime = Date.now();
            if (!onBreak) {
                statusText.textContent = "Focus status: You seem engaged 🙂";
                statusText.style.color = "#2f9e44";
            }
        }
    });

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        streamRef = stream;
        video.srcObject = stream;

        const camera = new Camera(video, {
            onFrame: async () => {
                if (cameraEnabled) {
                    await faceDetection.send({ image: video });
                    checkFocusTimeout();
                }
            },
            width: 640,
            height: 480
        });

        camera.start();
    });
}

/* ================= FOCUS → BREAK LOGIC ================= */
function checkFocusTimeout() {
    const now = Date.now();
    const timeAway = now - lastFaceTime;

    if (onBreak) return;

    if (timeAway > 15000) {
        showBreakSuggestion();
    }
}

/* ================= MICRO BREAK ================= */
function showBreakSuggestion() {
    document.getElementById("breakBox").style.display = "block";
}

function startBreak() {
    onBreak = true;
    breakSeconds = 120;
    document.getElementById("breakBox").style.display = "block";

    updateBreakTimer();
    breakInterval = setInterval(() => {
        breakSeconds--;
        updateBreakTimer();
        if (breakSeconds <= 0) endBreak();
    }, 1000);

    const statusText = document.getElementById("focusStatus");
    statusText.textContent = "Break time 💙";
    statusText.style.color = "#4a6cf7";
}

function updateBreakTimer() {
    const m = String(Math.floor(breakSeconds / 60)).padStart(2, "0");
    const s = String(breakSeconds % 60).padStart(2, "0");
    document.getElementById("breakTimer").textContent = `${m}:${s}`;
}

function endBreak() {
    clearInterval(breakInterval);
    onBreak = false;
    document.getElementById("breakBox").style.display = "none";

    const statusText = document.getElementById("focusStatus");
    statusText.textContent = "Welcome back 🙂";
    statusText.style.color = "#2f9e44";

    lastFaceTime = Date.now();
}

function skipBreak() {
    document.getElementById("breakBox").style.display = "none";
}
