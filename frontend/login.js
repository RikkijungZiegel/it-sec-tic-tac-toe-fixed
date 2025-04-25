let isLoginMode = true;

function toggleAuth() {
  isLoginMode = !isLoginMode;
  document.getElementById("auth-title").innerText = isLoginMode ? "Login" : "Registrieren";
  document.querySelector(".auth-btn").innerText = isLoginMode ? "Login" : "Registrieren";
  document.getElementById("toggle-auth").innerText = isLoginMode
    ? "Kein Konto? Registrieren"
    : "Schon registriert? Zum Login";

  document.getElementById("repeat-password").classList.toggle("hide", isLoginMode);
  document.getElementById("auth-msg").innerText = "";
}

async function handleAuth() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const repeatPass = document.getElementById("repeat-password").value.trim();
  const msg = document.getElementById("auth-msg");

  if (!username || !password || (!isLoginMode && !repeatPass)) {
    return showMessage("Bitte alle Felder ausfüllen.", "red");
  }

  if (!isLoginMode && password !== repeatPass) {
    return showMessage("Passwörter stimmen nicht überein ❗", "red");
  }

  const endpoint = isLoginMode ? "/login" : "/register";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (response.ok) {
    if (isLoginMode) {
      showMessage(data.message + " ✅", "green");
      showGameUI();
    } else {
      showMessage(data.message + " ✅ Jetzt einloggen.", "green");
      toggleAuth();
    }
  } else {
    showMessage(data.message + " ❌", "red");
  }
}

function showMessage(text, color) {
  const msg = document.getElementById("auth-msg");
  msg.innerText = text;
  msg.style.color = color;
}

function showGameUI() {
    document.getElementById("auth").style.display = "none"; 
    document.getElementById("game-ui").style.display = "block";
    document.getElementById("load-game").style.display = "block";
  }
