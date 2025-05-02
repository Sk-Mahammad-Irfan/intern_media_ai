document.addEventListener("DOMContentLoaded", () => {
  // --- USER AUTH STATE ---
  const userData = localStorage.getItem("user_data");

  const avatarDropdownDesktop = document.getElementById("userAvatarDropdown");
  const signInDesktop = document.getElementById("signInDesktop");
  const signInMobile = document.getElementById("signInMobile");
  const avatar = document.getElementById("navbar-avatar");

  const usernameDesktop = document.getElementById("account-username");
  const emailDesktop = document.getElementById("account-email");

  const usernameMobile = document.getElementById("account-username-mobile");
  const emailMobile = document.getElementById("account-email-mobile");

  const authOnlyMobile = document.querySelectorAll(".mobile-auth-only");

  if (userData) {
    const user = JSON.parse(userData);

    if (signInDesktop) signInDesktop.classList.add("d-none");
    if (signInMobile) signInMobile.classList.add("d-none");
    if (avatarDropdownDesktop) avatarDropdownDesktop.classList.remove("d-none");

    const initial = user.username
      ? user.username.charAt(0).toUpperCase()
      : user.email?.charAt(0).toUpperCase() || "U";

    if (avatar) avatar.textContent = initial;

    if (usernameDesktop) usernameDesktop.textContent = user.username || "User";
    if (emailDesktop) emailDesktop.textContent = user.email || "";

    if (usernameMobile) usernameMobile.textContent = user.username || "User";
    if (emailMobile) emailMobile.textContent = user.email || "";

    if (authOnlyMobile) authOnlyMobile.forEach(el => el.classList.remove("d-none"));

  } else {
    if (signInDesktop) signInDesktop.classList.remove("d-none");
    if (signInMobile) signInMobile.classList.remove("d-none");
    if (avatarDropdownDesktop) avatarDropdownDesktop.classList.add("d-none");

    if (authOnlyMobile) authOnlyMobile.forEach(el => el.classList.add("d-none"));
  }


  // --- SIDEBAR ACTIVE LINK HIGHLIGHT ---
  const path = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".sidebar .nav-link");

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
      link.classList.remove("text-secondary");
    } else {
      link.classList.remove("active");
      link.classList.add("text-secondary");
    }
  });
});

// --- LOGOUT FUNCTION ---
function logout() {
  localStorage.removeItem("user_data");
  localStorage.removeItem("userId");
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "auth.html";
}

// --- MOBILE SEARCH SIDEBAR TOGGLE ---
const searchBtn = document.getElementById("mobileSearchBtn");
const sidebar = document.getElementById("mobileSearchSidebar");
const closeBtn = document.getElementById("closeSearchSidebar");

searchBtn.addEventListener("click", () => {
  sidebar.style.transform = "translateX(0)";
});

closeBtn.addEventListener("click", () => {
  sidebar.style.transform = "translateX(-100%)";
});

document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !searchBtn.contains(e.target)) {
    sidebar.style.transform = "translateX(-100%)";
  }
});

document.addEventListener("keydown", function (event) {
  // If "/" is pressed and not inside an input/textarea
  if (event.key === "/" && !event.target.matches("input, textarea")) {
    event.preventDefault(); // Prevent default "/" character
    const searchInput = document.getElementById("navbarSearch");
    if (searchInput) {
      searchInput.focus();
    }
  }
});