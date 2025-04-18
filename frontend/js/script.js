
  document.addEventListener("DOMContentLoaded", () => {
    // --- USER AUTH STATE ---
    const userData = localStorage.getItem("user_data");

    const avatarDropdownDesktop = document.getElementById("userAvatarDropdown");
    const avatarDropdownMobile = document.querySelector("#navbarDropdown + .dropdown-menu");

    const signInDesktop = document.getElementById("signInDesktop");
    const signInMobile = document.getElementById("signInMobile");

    const avatar = document.getElementById("navbar-avatar");

    const usernameEls = document.querySelectorAll("#account-username");
    const emailEls = document.querySelectorAll("#account-email");

    if (userData) {
      const user = JSON.parse(userData);

      if (signInDesktop) signInDesktop.classList.add("d-none");
      if (signInMobile) signInMobile.classList.add("d-none");

      if (avatarDropdownDesktop) avatarDropdownDesktop.classList.remove("d-none");

      const initial = user.username
        ? user.username.charAt(0).toUpperCase()
        : user.email?.charAt(0).toUpperCase() || "U";

      if (avatar) avatar.textContent = initial;

      usernameEls.forEach(el => el.textContent = user.username || "User");
      emailEls.forEach(el => el.textContent = user.email || "");
    } else {
      if (signInDesktop) signInDesktop.classList.remove("d-none");
      if (signInMobile) signInMobile.classList.remove("d-none");
      if (avatarDropdownDesktop) avatarDropdownDesktop.classList.add("d-none");
    }

    // --- TOOLTIP INIT ---
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el, {
      placement: 'right',
      trigger: 'hover'
    }));

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

