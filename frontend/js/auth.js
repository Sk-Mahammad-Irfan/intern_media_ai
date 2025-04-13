const form = document.getElementById("auth-form");
const toggleLink = document.getElementById("toggle-link");
const toggleText = document.getElementById("toggle-text");
const submitBtn = document.getElementById("submit-btn");
const formTitle = document.getElementById("form-title");
const msg = document.getElementById("msg");

let isLogin = true;

toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  formTitle.innerText = isLogin ? "Login" : "Sign Up";
  submitBtn.innerText = isLogin ? "Login" : "Sign Up";
  toggleText.innerText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  toggleLink.innerText = isLogin ? "Sign Up" : "Login";
  msg.innerText = "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.innerText = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
  const payload = isLogin
    ? { email, password }
    : {
        email,
        password,
        username: email.split("@")[0], // or ask for username separately
      };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      msg.innerText = data.message;
    } else {
      alert(`${isLogin ? "Logged in" : "Registered"} successfully`);
      window.location.href = "/"; // redirect after success
    }
  } catch (err) {
    msg.innerText = "Something went wrong!";
    console.error(err);
  }
});
