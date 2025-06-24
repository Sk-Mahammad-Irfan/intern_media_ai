document.addEventListener("DOMContentLoaded", () => {
  const createKeyBtn = document.querySelector(".create-btn");
  const apiKeyList = document.getElementById("apiKeyList");
  const createKeyForm = document.getElementById("createKeyForm");
  const apiKeyLabelInput = document.getElementById("apiKeyLabel");
  const createKeyModal = new bootstrap.Modal(
    document.getElementById("createKeyModal")
  );

  async function fetchAPIKeys() {
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`${BACKEND_URL}/api/api-key/my-api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      renderAPIKeys(data.keys || []);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
      apiKeyList.innerHTML = `<p class="text-danger">Error loading API keys.</p>`;
    }
  }

  async function createAPIKey(label) {
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch("${BACKEND_URL}/api/api-key/generate-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, label }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "API key created.");
        fetchAPIKeys();
      } else {
        alert(data.message || "Failed to create API key.");
      }
    } catch (err) {
      console.error("Error creating API key:", err);
      alert("An error occurred while creating the key.");
    }
  }

  async function deleteAPIKey(key) {
    if (!confirm("Are you sure you want to delete this API key?")) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/api-key/delete-api-key/${key}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        fetchAPIKeys();
      } else {
        alert(data.message || "Failed to delete API key.");
      }
    } catch (err) {
      console.error("Error deleting API key:", err);
      alert("An error occurred while deleting the key.");
    }
  }

  function renderAPIKeys(keys) {
    apiKeyList.innerHTML = "";

    if (!keys.length) {
      apiKeyList.innerHTML = `<p class="text-muted">No API keys found.</p>`;
      return;
    }

    keys.forEach(({ key, label }) => {
      const item = document.createElement("li");
      item.className =
        "list-group-item d-flex justify-content-between align-items-center flex-wrap";

      const keyWrapper = document.createElement("div");
      keyWrapper.className = "d-flex flex-column";

      const labelElement = document.createElement("strong");
      labelElement.textContent = label || "Unnamed Key";
      labelElement.className = "mb-1";

      const keyMasked = document.createElement("span");
      keyMasked.textContent = "*".repeat(20);
      keyMasked.setAttribute("data-real-key", key);
      keyMasked.setAttribute("data-visible", "false");

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-sm btn-link me-2";
      toggleBtn.textContent = "Show";
      toggleBtn.onclick = () => {
        const isVisible = keyMasked.getAttribute("data-visible") === "true";
        if (isVisible) {
          keyMasked.textContent = "*".repeat(20);
          toggleBtn.textContent = "Show";
          keyMasked.setAttribute("data-visible", "false");
        } else {
          keyMasked.textContent = key;
          toggleBtn.textContent = "Hide";
          keyMasked.setAttribute("data-visible", "true");
        }
      };

      const keyRow = document.createElement("div");
      keyRow.className = "d-flex align-items-center";
      keyRow.appendChild(keyMasked);
      keyRow.appendChild(toggleBtn);

      keyWrapper.appendChild(labelElement);
      keyWrapper.appendChild(keyRow);

      const btnGroup = document.createElement("div");
      btnGroup.className = "d-flex align-items-center";

      const copyBtn = document.createElement("button");
      copyBtn.className = "btn btn-sm btn-outline-secondary me-2";
      copyBtn.innerHTML = `<i class="bi bi-clipboard"></i> Copy`;
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(key).then(() => {
          copyBtn.innerHTML = `<i class="bi bi-check-circle text-success"></i> Copied`;
          setTimeout(() => {
            copyBtn.innerHTML = `<i class="bi bi-clipboard"></i> Copy`;
          }, 2000);
        });
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm btn-outline-danger";
      deleteBtn.innerHTML = `<i class="bi bi-trash"></i> Delete`;
      deleteBtn.onclick = () => deleteAPIKey(key);

      btnGroup.appendChild(copyBtn);
      btnGroup.appendChild(deleteBtn);

      item.appendChild(keyWrapper);
      item.appendChild(btnGroup);
      apiKeyList.appendChild(item);
    });
  }

  // Open modal on "Create Key" click
  createKeyBtn.addEventListener("click", () => {
    apiKeyLabelInput.value = "";
    createKeyModal.show();
  });

  // Handle modal form submission
  createKeyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const label = apiKeyLabelInput.value.trim();
    if (label) {
      createAPIKey(label);
      createKeyModal.hide();
    }
  });

  // Load API keys on start
  fetchAPIKeys();
});
