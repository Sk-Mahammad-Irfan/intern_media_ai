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

/**
 * Authentication utility functions
 */

// Check if user is authenticated
function isAuthenticated() {
  const userData = localStorage.getItem("user_data");
  const authToken = localStorage.getItem("Auth_token");

  return !!(userData || authToken);
}

// Update UI based on authentication state
function updateAuthUI() {
  const signInButtons = document.querySelectorAll(".auth-sign-in-button");

  if (isAuthenticated()) {
    // User is authenticated, hide sign in buttons
    signInButtons.forEach((button) => {
      button.style.display = "none";
    });
  } else {
    // User is not authenticated, show sign in buttons
    signInButtons.forEach((button) => {
      button.style.display = "block";
    });
  }
}

// Update sidebar active state based on current page
function updateSidebarActiveState() {
  // Get current page path
  const currentPath =
    window.location.pathname.split("/").pop() || "dashboard.html";

  // Remove active class from all nav links
  document.querySelectorAll(".sidebar .nav-link").forEach((link) => {
    link.classList.remove(
      "active",
      "text-primary",
      "bg-primary",
      "bg-opacity-10"
    );
    link.classList.add("text-secondary");
  });

  // Add active class to current page link
  const currentLink = document.querySelector(
    `.sidebar .nav-link[href="${currentPath}"]`
  );
  if (currentLink) {
    currentLink.classList.remove("text-secondary");
    currentLink.classList.add(
      "active",
      "text-primary",
      "bg-primary",
      "bg-opacity-10"
    );
  }

  // Also update mobile menu active state
  document.querySelectorAll(".offcanvas-body .nav-link").forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.remove("text-secondary");
      link.classList.add(
        "active",
        "text-primary",
        "bg-primary",
        "bg-opacity-10"
      );
    } else {
      link.classList.remove(
        "active",
        "text-primary",
        "bg-primary",
        "bg-opacity-10"
      );
      link.classList.add("text-secondary");
    }
  });
}

// Initialize authentication UI when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  updateAuthUI();
  updateSidebarActiveState();

  const token = getCookie("auth_token");
  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

  if (token && userData) {
    // Show avatar dropdown
    const userDropdown = document.getElementById("userAvatarDropdown");
    if (userDropdown) {
      userDropdown.classList.remove("d-none");
    }

    // Set initials
    const avatar = document.getElementById("navbar-avatar");
    if (avatar && userData.username) {
      avatar.textContent = userData.username.charAt(0).toUpperCase();
    }

    // Set user info in dropdown
    const nameElem = document.getElementById("account-username");
    const emailElem = document.getElementById("account-email");
    if (nameElem && emailElem) {
      nameElem.textContent = userData.username || "User";
      emailElem.textContent = userData.email || "No email";
    }
  }
});
