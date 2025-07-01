document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("verification-container");
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const error = urlParams.get("error");
  const success = urlParams.get("success");

  if (success) {
    showSuccessMessage();
  } else if (error) {
    showErrorMessage(error);
  } else if (token) {
    verifyEmailToken(token);
  } else {
    showInvalidLinkMessage();
  }

  function showSuccessMessage() {
    container.innerHTML = `
      <div class="success-icon">✓</div>
      <h1>Email Verified Successfully!</h1>
      <p>Your email address has been successfully verified.</p>
      <button id="goToHomeBtn" class="btn">Go to Homepage</button>
    `;

    document.getElementById("goToHomeBtn").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  function showErrorMessage(error) {
    let errorMessage = "There was an error verifying your email.";
    if (error === "invalid_token") {
      errorMessage = "The verification link is invalid or has expired.";
    } else if (error === "server_error") {
      errorMessage = "A server error occurred. Please try again later.";
    }

    container.innerHTML = `
      <div class="error-icon">✗</div>
      <h1>Verification Failed</h1>
      <p>${errorMessage}</p>
      <button id="resendVerificationBtn" class="btn">Request New Verification Email</button>
    `;

    document
      .getElementById("resendVerificationBtn")
      .addEventListener("click", () => {
        const email = localStorage.getItem("unverifiedEmail");
        if (email) {
          resendVerificationEmail(email);
        } else {
          window.location.href = "register.html";
        }
      });
  }

  function showInvalidLinkMessage() {
    container.innerHTML = `
      <div class="error-icon">!</div>
      <h1>Invalid Verification Link</h1>
      <p>The verification link you used is incomplete.</p>
      <a href="index.html" class="btn">Go to Homepage</a>
    `;
  }

  async function verifyEmailToken(token) {
    container.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <h1>Verifying Your Email</h1>
        <p>Please wait while we verify your email address...</p>
      </div>
    `;

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/auth/verify-email?token=${token}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Verification failed");

      // Store user data and token like in login
      localStorage.setItem("user_data", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user.userId);
      document.cookie = `token=${data.token}; Path=/;`;
      document.cookie = `auth_token=${data.token}; Path=/;`;

      // Show success and redirect after short delay
      showSuccessMessage();
      setTimeout(() => {
        window.location.href =
          data.user.role === "1" ? "integrations.html" : "index.html";
      }, 3000);
    } catch (error) {
      console.error("Verification error:", error);
      showErrorMessage("invalid_token");
    }
  }

  async function resendVerificationEmail(email) {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("Verification email resent. Please check your inbox.");
    } catch (error) {
      console.error("Resend error:", error);
      alert("Failed to resend verification email: " + error.message);
    }
  }
});
