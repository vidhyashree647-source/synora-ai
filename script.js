// ==========================================
// SYNORA AI
// ==========================================


// ==========================================
// NAVIGATION
// ==========================================

function showSection(sectionName, clickedButton) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(function(section) {

        section.classList.remove(
            "active-section"
        );

    });


    const selectedSection =
        document.getElementById(sectionName);


    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    const buttons =
        document.querySelectorAll(".nav-btn");


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });


    if (clickedButton) {

        clickedButton.classList.add("active");

    }

}


// ==========================================
// ANALYZE TEXT
// ==========================================

async function analyzeText() {

    const input =
        document.getElementById("textInput");


    const text =
        input.value.trim();


    if (!text) {

        alert("Please enter some text first.");

        return;

    }


    try {

        const response =
            await fetch("/analyze", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    text: text
                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Analysis failed."
            );

            return;

        }


        // SENTIMENT

        document.getElementById(
            "sentiment"
        ).textContent =
            data.sentiment;


        document.getElementById(
            "sentimentScore"
        ).textContent =
            "Score: " + data.score;


        // PROGRESS BAR

        const bar =
            document.getElementById(
                "sentimentBar"
            );


        let percentage =
            ((data.score + 1) / 2) * 100;


        if (percentage < 0) {
            percentage = 0;
        }


        if (percentage > 100) {
            percentage = 100;
        }


        bar.style.width =
            percentage + "%";


        // EMOTION

        document.getElementById(
            "emotion"
        ).textContent =
            data.emotion;


        document.getElementById(
            "emotionIcon"
        ).textContent =
            data.emotion_icon;


        // CONFIDENCE

        document.getElementById(
            "confidence"
        ).textContent =
            data.confidence + "%";


        // COUNTS

        document.getElementById(
            "wordCount"
        ).textContent =
            data.words;


        document.getElementById(
            "charCount"
        ).textContent =
            data.characters;


        document.getElementById(
            "sentenceCount"
        ).textContent =
            data.sentences;


        // EMOTION PAGE

        document.getElementById(
            "emotionMain"
        ).textContent =
            data.emotion_icon;


        document.getElementById(
            "emotionMainText"
        ).textContent =
            data.emotion;


        // SHOW RESULT

        document.getElementById(
            "resultPanel"
        ).style.display =
            "block";

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to connect to SYNORA AI backend."
        );

    }

}


// ==========================================
// VOICE
// ==========================================

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice recognition is not supported in this browser."
        );

        return;

    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-US";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    const voiceStatus =
        document.getElementById(
            "voiceStatus"
        );


    if (voiceStatus) {

        voiceStatus.textContent =
            "Listening...";

    }


    recognition.start();


    recognition.onresult =
        function(event) {

            const speechText =
                event.results[0][0]
                    .transcript;


            document.getElementById(
                "textInput"
            ).value =
                speechText;


            if (voiceStatus) {

                voiceStatus.textContent =
                    "Speech captured successfully.";

            }

        };


    recognition.onerror =
        function() {

            if (voiceStatus) {

                voiceStatus.textContent =
                    "Voice recognition failed.";

            }

        };


    recognition.onend =
        function() {

            if (
                voiceStatus &&
                voiceStatus.textContent ===
                "Listening..."
            ) {

                voiceStatus.textContent =
                    "Microphone ready";

            }

        };

}


// ==========================================
// TEXT SCANNER
// ==========================================

function scanText() {

    const input =
        document.getElementById(
            "scanInput"
        );


    const text =
        input.value.trim();


    if (!text) {

        alert(
            "Please enter some text."
        );

        return;

    }


    const words =
        text.split(/\s+/)
            .filter(Boolean);


    const sentences =
        text.split(/[.!?]+/)
            .filter(function(sentence) {

                return sentence.trim()
                    .length > 0;

            });


    document.getElementById(
        "scanWords"
    ).textContent =
        words.length;


    document.getElementById(
        "scanCharacters"
    ).textContent =
        text.length;


    document.getElementById(
        "scanSentences"
    ).textContent =
        sentences.length;

}


// ==========================================
// CTRL + ENTER
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            const chat =
                document.getElementById(
                    "chat"
                );


            if (
                chat &&
                chat.classList.contains(
                    "active-section"
                )
            ) {

                analyzeText();

            }

        }

    }
);
// ==========================================
// OPEN EMOTION PAGE
// ==========================================

function openEmotion(clickedButton) {

    // Hide all sections
    const sections = document.querySelectorAll(".section");

    sections.forEach(function(section) {
        section.classList.remove("active-section");
        section.style.display = "none";
    });

    // Show Emotion section
    const emotionSection = document.getElementById("emotion");

    if (emotionSection) {
        emotionSection.classList.add("active-section");
        emotionSection.style.display = "block";
    }

    // Remove active from all buttons
    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(function(button) {
        button.classList.remove("active");
    });

    // Make Emotion button active
    if (clickedButton) {
        clickedButton.classList.add("active");
    }
}
function openEmotion(button) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(function(section) {
        section.classList.remove("active-section");
    });

    const emotionPage = document.getElementById("emotion");

    if (emotionPage) {
        emotionPage.classList.add("active-section");
    }

    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}
// ==========================================
// CHAT HISTORY
// ==========================================

let chatHistory = [];


function addToHistory(text, sentiment, emotion, icon) {

    chatHistory.push({
        text: text,
        sentiment: sentiment,
        emotion: emotion,
        icon: icon
    });

    displayHistory();
}


function displayHistory() {

    const historyList =
        document.getElementById("historyList");

    if (!historyList) {
        return;
    }


    if (chatHistory.length === 0) {

        historyList.innerHTML =
            '<p class="empty-history">No analysis history yet.</p>';

        return;
    }


    historyList.innerHTML = "";


    chatHistory.forEach(function(item, index) {

        const historyItem =
            document.createElement("div");

        historyItem.className =
            "history-item";


        historyItem.innerHTML = `
            <div class="history-number">
                ${index + 1}
            </div>

            <div class="history-content">

                <p class="history-text">
                    ${item.text}
                </p>

                <div class="history-result">

                    <span>
                        ${item.icon} ${item.emotion}
                    </span>

                    <span>
                        ${item.sentiment}
                    </span>

                </div>

            </div>
        `;


        historyList.appendChild(historyItem);

    });

}


function clearHistory() {

    chatHistory = [];

    displayHistory();

}