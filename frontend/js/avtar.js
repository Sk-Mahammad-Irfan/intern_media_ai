  function setAvatarInitials() {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

        const avatars = document.querySelectorAll("#navbar-avatar");
        const userElements = {
          desktop: {
            username: document.getElementById("account-username"),
            email: document.getElementById("account-email"),
          },
          mobile: {
            username: document.getElementById("account-username-mobile"),
            email: document.getElementById("account-email-mobile"),
          },
        };

        const isLoggedIn = !!userData.username;

        if (isLoggedIn) {
          const username = userData.username;
          const firstInitial = username.trim()[0]?.toUpperCase() || "U";

          avatars.forEach((avatar) => (avatar.textContent = firstInitial));

          userElements.desktop.username &&
            (userElements.desktop.username.textContent = username);
          userElements.desktop.email &&
            (userElements.desktop.email.textContent =
              userData.email || "No email");

          userElements.mobile.username &&
            (userElements.mobile.username.textContent = username);
          userElements.mobile.email &&
            (userElements.mobile.email.textContent =
              userData.email || "No email");
        } else {
          avatars.forEach((avatar) => {
            avatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
          });

          ["desktop", "mobile"].forEach((view) => {
            userElements[view].username &&
              (userElements[view].username.textContent = "Guest");
            userElements[view].email &&
              (userElements[view].email.textContent = "");
          });
        }
      }

      document.addEventListener("DOMContentLoaded", setAvatarInitials);