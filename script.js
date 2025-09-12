// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyBjks6fStCl_-FHqeHOXcBDgQNZtFmnU_g",
  authDomain: "chatbox-1dafe.firebaseapp.com",
  projectId: "chatbox-1dafe",
  storageBucket: "chatbox-1dafe.firebasestorage.app",
  messagingSenderId: "1014905322794",
  appId: "1:1014905322794:web:63ce73964f69c89a8e3253",
  measurementId: "G-LH6NQ1WEX3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Chat Elements ---
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatWindow = document.getElementById("chat-window");

// Listen for messages
db.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
  chatWindow.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.innerHTML = `
      <span>${data.text}</span>
      <button onclick="editMessage('${doc.id}', '${data.text}')">✏️</button>
      <button onclick="deleteMessage('${doc.id}')">🗑️</button>
    `;
    chatWindow.appendChild(msgDiv);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Send message
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  if (chatInput.value.trim() !== "") {
    db.collection("messages").add({
      text: chatInput.value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    chatInput.value = "";
  }
});

// Delete message
function deleteMessage(id) {
  db.collection("messages").doc(id).delete();
}

// Edit message
function editMessage(id, oldText) {
  const newText = prompt("Edit your message:", oldText);
  if (newText && newText.trim() !== "") {
    db.collection("messages").doc(id).update({ text: newText });
  }
}

