// =====================================
// CodeMentor AI - Main JS
// =====================================

// =====================================
// IMPORTANT
// Replace with your Gemini API Key
// =====================================

const API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";

const generateBtn = document.getElementById("generateBtn");
const questionInput = document.getElementById("question");

const explanationBox = document.getElementById("explanation");
const algorithmBox = document.getElementById("algorithm");
const complexityBox = document.getElementById("complexity");

const tabButtons = document.querySelectorAll(".tab-btn");
const codeBlocks = document.querySelectorAll(".code-block");

let generatedCodes = {
    python: "",
    c: "",
    java: "",
    javascript: ""
};

// =====================================
// Tabs
// =====================================

tabButtons.forEach(button => {
    button.addEventListener("click", () => {

        tabButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        codeBlocks.forEach(block =>
            block.classList.remove("active")
        );

        button.classList.add("active");

        const target = button.dataset.tab;

        document
            .getElementById(target)
            .classList.add("active");
    });
});

// =====================================
// Generate Button
// =====================================

generateBtn.addEventListener("click", async () => {

    const question = questionInput.value.trim();

    if (!question) {
        alert("Please enter a programming question.");
        return;
    }

    generateBtn.innerHTML = "Generating...";
    generateBtn.disabled = true;

    try {

        const prompt = `
You are an expert programming tutor.

For the following question return EXACTLY in this format:

EXPLANATION:
...

ALGORITHM:
...

COMPLEXITY:
Time Complexity:
Space Complexity:

PYTHON:
<python code>

C:
<c code>

JAVA:
<java code>

JAVASCRIPT:
<javascript code>

Question:
${question}
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response received.";

        parseResponse(text);

        saveToHistory(question);

    } catch (error) {

        console.error(error);

        alert(
            "Error generating solution. Check API key."
        );

    }

    generateBtn.innerHTML =
        `<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Solution`;

    generateBtn.disabled = false;
});

// =====================================
// Parse AI Response
// =====================================

function parseResponse(text) {

    explanationBox.textContent =
        extractSection(text, "EXPLANATION:", "ALGORITHM:");

    algorithmBox.textContent =
        extractSection(text, "ALGORITHM:", "COMPLEXITY:");

    complexityBox.textContent =
        extractSection(text, "COMPLEXITY:", "PYTHON:");

    generatedCodes.python =
        extractSection(text, "PYTHON:", "C:");

    generatedCodes.c =
        extractSection(text, "C:", "JAVA:");

    generatedCodes.java =
        extractSection(text, "JAVA:", "JAVASCRIPT:");

    generatedCodes.javascript =
        extractSection(text, "JAVASCRIPT:", null);

    document.getElementById("python").textContent =
        generatedCodes.python;

    document.getElementById("c").textContent =
        generatedCodes.c;

    document.getElementById("java").textContent =
        generatedCodes.java;

    document.getElementById("javascript").textContent =
        generatedCodes.javascript;
}

// =====================================
// Extract Section
// =====================================

function extractSection(text, start, end) {

    const startIndex = text.indexOf(start);

    if (startIndex === -1) return "";

    let endIndex;

    if (end) {
        endIndex = text.indexOf(end);
    } else {
        endIndex = text.length;
    }

    return text
        .substring(startIndex + start.length, endIndex)
        .trim();
}

// =====================================
// Copy Code
// =====================================

const copyBtn =
    document.querySelector(".copy-btn");

copyBtn.addEventListener("click", () => {

    const activeCode =
        document.querySelector(".code-block.active");

    navigator.clipboard.writeText(
        activeCode.textContent
    );

    copyBtn.innerHTML =
        `<i class="fa-solid fa-check"></i> Copied`;

    setTimeout(() => {

        copyBtn.innerHTML =
            `<i class="fa-regular fa-copy"></i> Copy Code`;

    }, 2000);

});

// =====================================
// Download Code
// =====================================

const downloadBtn =
    document.querySelector(".download-btn");

downloadBtn.addEventListener("click", () => {

    const activeCode =
        document.querySelector(".code-block.active");

    const code =
        activeCode.textContent;

    const language =
        activeCode.id;

    let extension = "txt";

    if (language === "python")
        extension = "py";

    if (language === "c")
        extension = "c";

    if (language === "java")
        extension = "java";

    if (language === "javascript")
        extension = "js";

    const blob = new Blob(
        [code],
        { type: "text/plain" }
    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `solution.${extension}`;

    a.click();

    URL.revokeObjectURL(url);

});

// =====================================
// Search History
// =====================================

function saveToHistory(question) {

    const history =
        JSON.parse(
            localStorage.getItem("codementor_history")
        ) || [];

    history.unshift({
        question,
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "codementor_history",
        JSON.stringify(history)
    );
}
