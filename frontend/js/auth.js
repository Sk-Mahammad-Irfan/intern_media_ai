const form = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const toggleText = document.getElementById("toggle-text");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const msg = document.getElementById("msg");
const usernameField = document.getElementById("username-field");

let isLogin = true;

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

// Toggle between login and register forms
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

// Form submission handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Reset UI states
  msg.textContent = "";
  msg.className = "message"; // Base message class
  submitBtn.disabled = true;
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = isLogin ? "Logging in..." : "Registering...";

  // Clear previous error states
  document.querySelectorAll(".input-error").forEach((el) => {
    el.classList.remove("input-error");
    const errorText = el.nextElementSibling;
    if (errorText && errorText.classList.contains("error-text")) {
      errorText.remove();
    }
  });

  // Get form data
  const formData = new FormData(form);
  const email = formData.get("email").trim();
  const password = formData.get("password");
  const username = isLogin ? null : formData.get("username").trim();

  // Client-side validation
  if (!email || !password || (!isLogin && !username)) {
    showFieldError("Please fill all required fields");
    if (!email) highlightErrorField("email");
    if (!password) highlightErrorField("password");
    if (!isLogin && !username) highlightErrorField("username");
    return;
  }

  if (!isLogin && username.length < 3) {
    showFieldError("Username must be at least 3 characters");
    highlightErrorField("username");
    return;
  }

  if (!validator.isEmail(email)) {
    showFieldError("Please enter a valid email address");
    highlightErrorField("email");
    return;
  }

  if (password.length < 8) {
    showFieldError("Password must be at least 8 characters");
    highlightErrorField("password");
    return;
  }

  try {
    const endpoint = isLogin ? "/login" : "/register";
    const body = isLogin ? { email, password } : { username, email, password };

    const response = await fetch(`${BACKEND_URL}/api/auth${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle API validation errors
      if (data.field) {
        showFieldError(data.message, data.field);
      } else {
        throw new Error(data.message || "Request failed");
      }
      return;
    }

    // Handle successful response
    if (data.success) {
      msg.classList.add("message-success");
      msg.textContent = data.message;

      if (data.token) {
        // Store user data
        const userData = {
          userId: data.user.userId,
          email: email,
          credits: data.user.credits,
          username: data.user.username || username || email.split("@")[0],
          role: data.user.role || "0",
          verified: data.user.verified || false,
        };

        // Set cookies and local storage
        setCookie("auth_token", data.token, 7);
        localStorage.setItem("user_data", JSON.stringify(userData));
        localStorage.setItem("userId", data.user.userId);

        // Handle redirection based on verification status
        if (data.user.verified) {
          setTimeout(() => {
            window.location.href =
              data.user.role === "1" ? "integrations.html" : "index.html";
          }, 1500);
        } else {
          localStorage.setItem("unverifiedEmail", email);
          setTimeout(() => {
            window.location.href = `verify-email.html?email=${encodeURIComponent(
              email
            )}`;
          }, 1500);
        }
      } else {
        // Registration without immediate login
        form.reset();
        localStorage.setItem("unverifiedEmail", email);
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    msg.classList.add("message-error");

    // Special handling for unverified email
    if (error.message.includes("verify your email")) {
      msg.innerHTML = `${error.message} <a href="#" id="resend-link">Resend verification email</a>`;
      document.getElementById("resend-link").addEventListener("click", (e) => {
        e.preventDefault();
        resendVerificationEmail(email);
      });
    } else {
      msg.textContent =
        error.message ||
        (isLogin
          ? "Login failed. Please try again."
          : "Registration failed. Please try again.");
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});

// Helper functions
function showFieldError(message, fieldName = null) {
  msg.classList.add("message-error");
  msg.textContent = message;

  if (fieldName) {
    highlightErrorField(fieldName);
  }
}

function highlightErrorField(fieldName) {
  const field = form.querySelector(`[name="${fieldName}"]`);
  if (field) {
    field.classList.add("input-error");

    // Add error text if not already present
    if (
      !field.nextElementSibling ||
      !field.nextElementSibling.classList.contains("error-text")
    ) {
      const errorText = document.createElement("p");
      errorText.className = "error-text";
      errorText.textContent =
        fieldName === "password"
          ? "Password must be at least 8 characters with uppercase, number, and special character"
          : `Please enter a valid ${fieldName}`;
      field.insertAdjacentElement("afterend", errorText);
    }
  }
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie =
    `${name}=${value}; ${expires}; path=/; SameSite=Lax` +
    (location.protocol === "https:" ? "; Secure" : "");
}

// Add resend verification function
async function resendVerificationEmail(email) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      msg.textContent = "Verification email resent. Please check your inbox.";
      msg.classList.remove("text-danger");
      msg.classList.add("text-success");
    } else {
      msg.textContent = data.message || "Failed to resend verification email";
      msg.classList.add("text-danger");
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "An error occurred while resending verification email";
    msg.classList.add("text-danger");
  }
}

// Google login handler
document.getElementById("google-login").addEventListener("click", () => {
  window.location.href = `http://localhost:5000/api/auth/google`;
});

// Check if user is already logged in
window.addEventListener("load", () => {
  const token = getCookie("auth_token");
  const userData = localStorage.getItem("user_data");

  if (token && userData) {
    const user = JSON.parse(userData);
    if (!user.verified) {
      window.location.href =
        "verify-email.html?email=" + encodeURIComponent(user.email);
    } else {
      window.location.href = "credits.html";
    }
  }
});

// Authentication utility functions

// Check if user is authenticated
function isAuthenticated() {
  const userData = localStorage.getItem("user_data");
  const authToken = getCookie("auth_token");

  if (userData && authToken) {
    const user = JSON.parse(userData);
    return user.verified; // Only return true if user is verified
  }
  return false;
}

// Update UI based on authentication state
function updateAuthUI() {
  const signInButtons = document.querySelectorAll(".auth-sign-in-button");
  const userDropdown = document.getElementById("userAvatarDropdown");
  const mobileAuthSection = document.querySelector(".mobile-auth-only");

  if (isAuthenticated()) {
    // User is authenticated
    signInButtons.forEach((button) => {
      button.style.display = "none";
    });
    if (userDropdown) userDropdown.classList.remove("d-none");
    if (mobileAuthSection) mobileAuthSection.classList.remove("dnone");
  } else {
    // User is not authenticated
    signInButtons.forEach((button) => {
      button.style.display = "block";
    });
    if (userDropdown) userDropdown.classList.add("d-none");
    if (mobileAuthSection) mobileAuthSection.classList.add("dnone");
  }
}

// Set avatar initials from user data
function setAvatarInitials() {
  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
  const username = userData.username || "User";
  const firstInitial = username.trim()[0].toUpperCase();

  // Update all avatars
  const avatars = document.querySelectorAll("#navbar-avatar");
  avatars.forEach((avatar) => {
    avatar.textContent = firstInitial;
  });

  // Update dropdown info
  const usernameElem = document.getElementById("account-username");
  const emailElem = document.getElementById("account-email");
  const mobileUsernameElem = document.getElementById("account-username-mobile");
  const mobileEmailElem = document.getElementById("account-email-mobile");

  if (usernameElem) usernameElem.textContent = username;
  if (emailElem) emailElem.textContent = userData.email || "No email";
  if (mobileUsernameElem) mobileUsernameElem.textContent = username;
  if (mobileEmailElem)
    mobileEmailElem.textContent = userData.email || "No email";
}

window.addEventListener("DOMContentLoaded", () => {
  setAvatarInitials();
});

// Update sidebar active state based on current page
function updateSidebarActiveState() {
  const currentPath =
    window.location.pathname.split("/").pop() || "dashboard.html";

  // Update desktop sidebar
  document.querySelectorAll(".sidebar .nav-link").forEach((link) => {
    link.classList.remove(
      "active",
      "text-primary",
      "bg-primary",
      "bg-opacity-10"
    );
    link.classList.add("text-secondary");
  });

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

  // Update mobile menu
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

// Logout function
function logout() {
  // Remove specific cookies
  const removeCookie = (name) => {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  // Clear cookies
  removeCookie("auth_token");
  removeCookie("token"); // original token name in your script

  // Clear localStorage items
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
  localStorage.removeItem("userId");
  localStorage.removeItem("ignoredProviders");

  // Redirect to homepage
  window.location.href = "index.html";
}

// Initialize authentication UI when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  updateAuthUI();
  updateSidebarActiveState();

  const token = getCookie("auth_token");
  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

  if (token && userData.username) {
    setAvatarInitials();
  }
});

// Expose logout function to global scope
window.logout = logout;
