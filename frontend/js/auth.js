const form = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const toggleText = document.getElementById("toggle-text");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const msg = document.getElementById("msg");
const usernameField = document.getElementById("username-field");

let isLogin = true;

// Function to set cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get cookie
function getCookie(name) {
  const cookieName = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) == 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Register";
  submitBtn.textContent = isLogin ? "Login" : "Register";
  toggleText.textContent = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  toggleLink.textContent = isLogin ? "Sign Up" : "Login";
  usernameField.classList.toggle("d-none", isLogin);
  usernameField.querySelector("input").required = !isLogin;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  const endpoint = isLogin ? "/login" : "/register";
  const body = isLogin ? { email, password } : { username, email, password };

  try {
    const res = await fetch(`http://localhost:5000/api/auth${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log(data);

    if (data.success) {
      msg.classList.remove("text-danger");
      msg.classList.add("text-success");
      msg.textContent = data.message;

      if (data.token) {
        // Store token in cookie (expires in 7 days)
        setCookie("auth_token", data.token, 7);

        // Store user data in localStorage
        const userData = {
          userId: data.user.userId,
          email: email,
          credits: data.user.credits,
          username: username || email.split("@")[0],
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem("user_data", JSON.stringify(userData));
        localStorage.setItem("userId", data.user.userId);
        document.cookie = `token=${data.token}; HttpOnly; Path=/;`;

        // Redirect to dashboard or home page after successful login
        window.location.href = "index.html";
      }
    } else {
      msg.textContent = data.message;
      msg.classList.add("text-danger");
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "An error occurred.";
  }
});

document.getElementById("google-login").addEventListener("click", () => {
  // Store the current URL in localStorage to redirect back after Google auth
  localStorage.setItem("redirect_after_auth", window.location.href);
  window.location.href = "http://localhost:5000/api/auth/google";
});

// Check if user is already logged in
window.addEventListener("load", () => {
  const token = getCookie("auth_token");
  const userData = localStorage.getItem("user_data");

  if (token && userData) {
    // User is already logged in, redirect to dashboard
    window.location.href = "credits.html";
  }
});
