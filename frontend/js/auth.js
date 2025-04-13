document.getElementById("toggle-link").addEventListener("click", function (e) {
  e.preventDefault();
  const title = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");
  const toggleText = document.getElementById("toggle-text");
  const toggleLink = document.getElementById("toggle-link");
  if (title.innerText === "Login") {
    title.innerText = "Sign Up";
    submitBtn.innerText = "Sign Up";
    toggleText.innerText = "Already have an account?";
    toggleLink.innerText = "Login";
  } else {
    title.innerText = "Login";
    submitBtn.innerText = "Login";
    toggleText.innerText = "Don't have an account?";
    toggleLink.innerText = "Sign Up";
  }
});