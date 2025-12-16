/******************** CONFIG ********************/
const GEMINI_API_KEY = "AIzaSyB0c3_J6PRYLIMt0iHo00VKd8pS3S5wMxE";

/******************** GLOBAL STATE ********************/
let currentFontSize = 16;
let lastFaceTime = Date.now();
let cameraEnabled = false;
let streamRef = null;

/******************** ON LOAD ********************/
window.onload = () => {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    }
    if (localStorage.getItem("fontSize")) {
        currentFontSize = parseInt(localStorage.getItem("fontSize"));
        document.body.style.fontSize = currentFontSize + "px";
    }
};

/******************** ACCESSIBILITY ********************/
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );
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

/******************** NOTES SIMPLIFIER ********************/
async function simplifyText() {
    const text = document.getElementById("inputText").value;
    const output = document.getElementById("output");
    const mode = document.getElementById("mode").value;

    if (!text.trim()) {
        output.innerHTML = "Please paste some notes 🙂";
        return;
    }

    /* SIMPLE MODE (NO AI) */
    if (mode === "simple") {
        output.innerHTML =
            "<ul>" +
            text
                .split(".")
                .filter(s => s.trim())
                .map(s => `<li>${s.trim()}</li>`)
                .join("") +
            "</ul>";
        return;
    }

    /* AI MODE */
    output.innerHTML = "🤖 Simplifying with AI...";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        "Simplify the following study notes into calm, clear bullet points suitable for a neurodiverse student:\n\n" +
                                        text
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!data.candidates || !data.candidates.length) {
            throw new Error("No AI response");
        }

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
        console.error(err);
        output.innerHTML =
            "❌ AI error. Check API key or quota.";
    }
}

/******************** CAMERA TOGGLE ********************/
function toggleCamera() {
    const status = document.getElementById("focusStatus");
    const btn = document.getElementById("cameraToggle");

    if (cameraEnabled) {
        if (streamRef) {
            streamRef.getTracks().forEach(track => track.stop());
        }
        cameraEnabled = false;
        btn.textContent = "Turn Camera On";
        status.textContent = "Focus camera is off 🌙";
        status.style.color = "#888";
    } else {
        cameraEnabled = true;
        btn.textContent = "Turn Camera Off";
        startFaceDetection();
    }
}

/******************** FACE DETECTION ********************/
function startFaceDetection() {
    if (!cameraEnabled) return;

    const video = document.getElementById("video");
    const status = document.getElementById("focusStatus");

    const faceDetection = new FaceDetection({
        locateFile: file =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
    });

    faceDetection.setOptions({
        model: "short",
        minDetectionConfidence: 0.6
    });

    faceDetection.onResults(results => {
        if (results.detections.length > 0) {
            lastFaceTime = Date.now();
            status.textContent = "Focus status: You seem engaged 🙂";
            status.style.color = "#2f9e44";
        }
    });

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        streamRef = stream;
        video.srcObject = stream;

        const camera = new Camera(video, {
            onFrame: async () => {
                if (cameraEnabled) {
                    await faceDetection.send({ image: video });
                }
            },
            width: 640,
            height: 480
        });

        camera.start();
    });
}
