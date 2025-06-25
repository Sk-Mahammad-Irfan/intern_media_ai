// Check if the user is authenticated and has the admin role
// If not, redirect to the login page
const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("auth_token="));
const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
// console.log(userData);

// Check if user is authenticated and has admin role (role === 1)
if (!token || userData.role !== 1) {
  window.location.href = "auth.html"; // Redirect to login or home
}

