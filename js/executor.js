const runBtn =
document.getElementById("runBtn");

const clearBtn =
document.getElementById("clearBtn");

const codeInput =
document.getElementById("codeInput");

const output =
document.getElementById("output");

const language =
document.getElementById("language");

let pyodide = null;

// =========================
// Load Pyodide
// =========================

async function loadPython() {

output.textContent =
"Loading Python Runtime...";

pyodide =
await loadPyodide();

output.textContent =
"Python Runtime Ready.";

}

loadPython();

// =========================
// Run Button
// =========================

runBtn.addEventListener("click", async () => {

const code =
codeInput.value;

if(!code){

alert("Please enter code.");

return;
}

output.textContent = "";

if(language.value === "javascript"){

runJavaScript(code);

}

if(language.value === "python"){

await runPython(code);

}

});

// =========================
// JavaScript Execution
// =========================

function runJavaScript(code){

try{

const logs = [];

const originalLog =
console.log;

console.log = (...args)=>{

logs.push(args.join(" "));

};

eval(code);

console.log =
originalLog;

output.textContent =
logs.join("\n");

}
catch(error){

output.textContent =
error;

}

}

// =========================
// Python Execution
// =========================

async function runPython(code){

try{

pyodide.setStdout({

batched: (text)=>{

output.textContent +=
text + "\n";

}

});

await pyodide.runPythonAsync(code);

}
catch(error){

output.textContent =
error;

}

}

// =========================
// Clear Output
// =========================

clearBtn.addEventListener("click",()=>{

output.textContent = "";

});
