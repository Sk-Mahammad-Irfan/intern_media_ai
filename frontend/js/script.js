document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

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

    if (authOnlyMobile)
      authOnlyMobile.forEach((el) => el.classList.remove("d-none"));
  } else {
    if (signInDesktop) signInDesktop.classList.remove("d-none");
    if (signInMobile) signInMobile.classList.remove("d-none");
    if (avatarDropdownDesktop) avatarDropdownDesktop.classList.add("d-none");

    if (authOnlyMobile)
      authOnlyMobile.forEach((el) => el.classList.add("d-none"));
  }

  // --- SIDEBAR ACTIVE LINK HIGHLIGHT ---
  const path = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".sidebar .nav-link");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
      link.classList.remove("text-secondary");
    } else {
      link.classList.remove("active");
      link.classList.add("text-secondary");
    }
  });

  console.log("Current page:", path);

  // --- ADMIN CHECK FOR ADDMODEL PAGE ---
  if (path === "addmodel.html") {
    console.log("Checking admin access...");
    checkAdminAccess();
  }
});

// --- ADMIN CHECK FUNCTION ---
async function checkAdminAccess() {
  const token = getCookie("auth_token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/admin-auth`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.log("Not an admin");
      window.location.href = "index.html"; // Not an admin
    }
  } catch (error) {
    console.error("Error checking admin access:", error);
    window.location.href = "index.html"; // Fallback redirect
  }
}

// --- HELPER TO GET COOKIE ---
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// --- LOGOUT FUNCTION ---
function logout() {
  const removeCookie = (name) => {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  removeCookie("auth_token");
  removeCookie("token");

  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
  localStorage.removeItem("userId");
  localStorage.removeItem("ignoredProviders");

  window.location.href = "index.html";
}

function checkLogin() {
  const cookieName = "auth_token";
  const cookieExists = document.cookie
    .split("; ")
    .some((row) => row.startsWith(`${cookieName}=`));

  return cookieExists;
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
  if (event.key === "/" && !event.target.matches("input, textarea")) {
    event.preventDefault();
    const searchInput = document.getElementById("navbarSearch");
    if (searchInput) {
      searchInput.focus();
    }
  }
});
