const historyContainer =
document.getElementById("historyContainer");

const clearAllBtn =
document.getElementById("clearAllBtn");

loadHistory();

function loadHistory() {

const history =
JSON.parse(
localStorage.getItem("codementor_history")
) || [];

historyContainer.innerHTML = "";

if(history.length === 0){

historyContainer.innerHTML = `
<div class="glass empty-history">
<h3>No Search History Found</h3>
<p>Generate your first solution from Home Page.</p>
</div>
`;

return;
}

history.forEach((item,index)=>{

const card =
document.createElement("div");

card.className =
"glass history-card";

card.innerHTML = `
<h3>${item.question}</h3>

<p>${item.date}</p>

<button onclick="deleteHistory(${index})">
<i class="fa-solid fa-trash"></i>
Delete
</button>
`;

historyContainer.appendChild(card);

});

}

function deleteHistory(index){

const history =
JSON.parse(
localStorage.getItem("codementor_history")
) || [];

history.splice(index,1);

localStorage.setItem(
"codementor_history",
JSON.stringify(history)
);

loadHistory();

}

clearAllBtn.addEventListener("click",()=>{

const confirmDelete =
confirm(
"Are you sure you want to clear all history?"
);

if(confirmDelete){

localStorage.removeItem(
"codementor_history"
);

loadHistory();

}

});
