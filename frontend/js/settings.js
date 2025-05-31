const select = document.getElementById("ignoredProvidersSelect");
const output = document.getElementById("ignoredProvidersOutput");
const ignoredProviders = new Set();

// Load from localStorage
const stored = localStorage.getItem("ignoredProviders");
if (stored) {
  const parsed = JSON.parse(stored);
  parsed.forEach(p => ignoredProviders.add(p));
  updateOutput();
  updateSelectOptions();
}

// Handle select change
if (select && output) {
  select.addEventListener("change", function () {
    const selected = select.value;
    if (selected && selected !== "Select a provider") {
      ignoredProviders.add(selected);
      localStorage.setItem("ignoredProviders", JSON.stringify(Array.from(ignoredProviders)));
      updateOutput();
      updateSelectOptions();
      select.selectedIndex = 0; // Reset selection
    }
  });
}

// Render ignored provider badges
function updateOutput() {
  output.innerHTML = "";

  if (ignoredProviders.size === 0) {
    output.textContent = "No providers are ignored.";
    return;
  }

  output.textContent = "Ignored providers: ";

  Array.from(ignoredProviders).forEach(provider => {
    const badge = document.createElement("span");
    badge.className = "badge bg-secondary me-1";
    badge.style.cursor = "pointer";
    badge.textContent = provider + " ✕";

    badge.onclick = function () {
      ignoredProviders.delete(provider);
      localStorage.setItem("ignoredProviders", JSON.stringify(Array.from(ignoredProviders)));
      updateOutput();
      updateSelectOptions();
    };

    output.appendChild(badge);
  });
}

// Disable already-selected providers in dropdown
function updateSelectOptions() {
  Array.from(select.options).forEach(option => {
    if (option.value && option.value !== "Select a provider") {
      option.disabled = ignoredProviders.has(option.value);
    }
  });
}


      // Load user_data from localStorage and update modal
      document.addEventListener("DOMContentLoaded", async () => {
        const userDataRaw = localStorage.getItem("user_data");
        const userId = localStorage.getItem("userId");

        if (userDataRaw) {
          try {
            const user = JSON.parse(userDataRaw);

            // Populate user name and email
            document.getElementById("user-name").textContent =
              user.username || "Unknown User";

            document.querySelectorAll(".primary-email").forEach((el) => {
              el.innerHTML = `${user.email} <span class="badge bg-secondary">Primary</span>`;
            });

            document.getElementById("user-loginTime").textContent = new Date(
              user.loginTime
            ).toLocaleString();

            document.getElementById("connected-email").textContent =
              user.email || "";

            // Avatar logic
            const username = user.username || "User";
            const firstInitial = username.trim()[0].toUpperCase();
            const avatar = document.getElementById("navbar-avatar");
            const profileImg = document.getElementById("profile-image");

            if (avatar && profileImg) {
              avatar.textContent = firstInitial;
              avatar.style.display = "flex";
              profileImg.style.display = "none"; // hide image
            }

            // 🟡 Fetch and display credits from backend
            if (userId) {
              const credits = await getUserCredits(userId);
              document.getElementById("user-credits").textContent =
                credits !== null ? credits : "N/A";
            }
          } catch (error) {
            console.error("Failed to parse user_data:", error);
          }
        }
      });