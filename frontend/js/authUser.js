// Check if the user is authenticated by looking for a token in cookies
const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("auth_token="));
if (!token) {
  window.location.href = "auth.html"; // Redirect to login/register page
}
