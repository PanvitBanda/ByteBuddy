const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const chatForm = document.getElementById("chatForm");
const themeToggle = document.getElementById("themeToggle");
const personalitySelect = document.getElementById("personalitySelect");

// Load theme from localStorage
if (localStorage.getItem("bytebuddy-theme") === "dark") {
  document.body.classList.add("dark");
}

// Load chat history
window.addEventListener("DOMContentLoaded", () => {
  const history = JSON.parse(localStorage.getItem("bytebuddy-history")) || [];
  history.forEach(msg => appendMessage(msg.text, msg.sender, msg.time));
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("bytebuddy-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Chat form submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  appendMessage(text, "user", time);
  saveMessage(text, "user", time);
  userInput.value = "";

  // Bot typing...
  const typing = document.createElement("div");
  typing.className = "message bot typing";
  typing.textContent = "Typing...";
  chatContainer.appendChild(typing);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const botReply = generateReply(text);
    const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    appendMessage(botReply, "bot", replyTime);
    saveMessage(botReply, "bot", replyTime);
  }, 1000);
});

function appendMessage(text, sender, time) {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.innerHTML = `${text}<div class="meta">${time}</div>`;
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function saveMessage(text, sender, time) {
  const history = JSON.parse(localStorage.getItem("bytebuddy-history")) || [];
  history.push({ text, sender, time });
  localStorage.setItem("bytebuddy-history", JSON.stringify(history));
}

function generateReply(input) {
  const personality = personalitySelect.value;
  const lower = input.toLowerCase();

  if (personality === "fun") {
    if (lower.includes("hi") || lower.includes("hello")) return "Heyyy! 😄 What’s up?";
    if (lower.includes("joke")) return "Why did the JS developer go broke? Because he kept using var when he should’ve let it go! 🤪";
    return "Haha, that’s funny. Tell me more!";
  } else if (personality === "chill") {
    if (lower.includes("hi") || lower.includes("hello")) return "Yo, what’s good? 😎";
    if (lower.includes("music")) return "Lo-fi beats and a chill code session. 🎧";
    return "Let’s vibe. Got anything on your mind?";
  } else {
    // pro
    if (lower.includes("hi") || lower.includes("hello")) return "Hello! How can I assist you today?";
    if (lower.includes("project")) return "I'm here to help you brainstorm or debug. What's the issue?";
    return "Interesting question. Let me think... 🤔";
  }
}
