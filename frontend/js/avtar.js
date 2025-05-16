function setAvatarInitials() {
  // Get the stored user data
  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

  // Get username or fallback to "User"
  const username = userData.username || "User";
  const firstInitial = username.trim()[0].toUpperCase();

  // Update all avatar elements
  const avatars = document.querySelectorAll("#navbar-avatar");
  avatars.forEach((avatar) => {
    avatar.textContent = firstInitial;
  });

  // Update dropdown username and email if they exist
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
