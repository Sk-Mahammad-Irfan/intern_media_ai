// Get user credits
async function getUserCredits(userId) {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(
      `${BACKEND_URL}/api/credits/credits/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.success ? data.credits : null;
  } catch (error) {
    console.error("Error getting credits:", error);
    return null;
  }
}

// Update user credits
async function updateUserCredits(userId, amount, method = "card") {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(`${BACKEND_URL}/api/credits/updatecredits`, {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        amount,
        method,
      }),
    });

    const data = await response.json();

    if (data.success) {
      updateCreditsDisplay(data.user.credits);
      fetchAndRenderCreditHistory(userId);
      return true;
    } else {
      console.error("Failed to update credits:", data.message);
      return false;
    }
  } catch (error) {
    console.error("Error updating credits:", error);
    return false;
  }
}

// Fetch credit history
// Fetch credit history with pagination
async function getCreditHistory(userId, page = 1, limit = 10) {
  try {
    const token = getAuthToken();
    if (!token) return [];

    const response = await fetch(
      `${BACKEND_URL}/api/credits/history/${userId}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.success ? data.history : [];
  } catch (error) {
    console.error("Error fetching credit history:", error);
    return [];
  }
}

// Render credit history
let currentPage = 1;
const creditsPerPage = 10;

async function fetchAndRenderCreditHistory(userId, page = 1) {
  const history = await getCreditHistory(userId, page, creditsPerPage);
  const container = document.getElementById("creditHistoryContainer");
  const paginationContainer = document.getElementById("paginationContainer");

  if (!container) return;

  if (history.length === 0 && page === 1) {
    container.innerHTML = `<p>No credit history found.</p>`;
    if (paginationContainer) paginationContainer.innerHTML = "";
    return;
  }

  container.innerHTML = history
    .map((entry) => {
      const date = new Date(entry.createdAt).toLocaleString();
      let colorClass;

      // Set color based on method
      if (entry.method === "usage") {
        colorClass = "text-danger"; // red
      } else if (entry.method === "api") {
        colorClass = "text-warning"; // orange
      } else {
        colorClass = "text-success"; // green
      }

      return `<div class="border-bottom py-2">
      <strong class="${colorClass}">${entry.amount} credits</strong> via <em>${entry.method}</em> on ${date}
    </div>`;
    })
    .join("");

  // Add pagination controls
  if (paginationContainer) {
    paginationContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mt-3">
        <button class="btn btn-outline-primary" id="prevPageBtn" ${
          page === 1 ? "disabled" : ""
        }>
          <i class="bi bi-chevron-left me-2"></i>Previous
        </button>
        <span>Page ${page}</span>
        <button class="btn btn-outline-primary" id="nextPageBtn" ${
          history.length < creditsPerPage ? "disabled" : ""
        }>
          Next<i class="bi bi-chevron-right ms-2"></i>
        </button>
      </div>
    `;

    document.getElementById("prevPageBtn")?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchAndRenderCreditHistory(userId, currentPage);
      }
    });

    document.getElementById("nextPageBtn")?.addEventListener("click", () => {
      if (history.length === creditsPerPage) {
        currentPage++;
        fetchAndRenderCreditHistory(userId, currentPage);
      }
    });
  }
}

// Update credits text
function updateCreditsDisplay(credits) {
  const creditsElement = document.querySelector(".display-4.fw-bold.text-dark");
  if (creditsElement)
    creditsElement.textContent = parseFloat(credits).toFixed(3);
}

// Get token helper
function getAuthToken() {
  const token = document.cookie.includes("token=")
    ? document.cookie.split("token=")[1].split(";")[0]
    : null;

  if (!token) {
    console.error("No authentication token found in cookies");
    return null;
  }

  return token;
}

// Handle add credits click
function handleAddCredits() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please log in to add credits");
    return;
  }

  const addCreditsModal = new bootstrap.Modal(
    document.getElementById("addCreditsModal")
  );
  addCreditsModal.show();
}

// Handle confirm button
function handleConfirmAddCredits() {
  const userId = localStorage.getItem("userId");
  const amountInput = document.getElementById("creditAmount");
  const paymentMethodSelect = document.getElementById("paymentMethod");

  if (!userId) {
    alert("Please log in to add credits");
    return;
  }

  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid positive number");
    return;
  }

  // Allow floating point numbers
  const method = paymentMethodSelect?.value || "card";

  updateUserCredits(userId, amount, method);

  // Close modal
  const addCreditsModal = bootstrap.Modal.getInstance(
    document.getElementById("addCreditsModal")
  );
  addCreditsModal.hide();
  amountInput.value = "";
}

// Handle crypto switch (placeholder)
function handleCryptoSwitch() {
  const cryptoSwitch = document.getElementById("cryptoSwitch");
  if (cryptoSwitch) {
    cryptoSwitch.addEventListener("change", function () {
      console.log(
        "Crypto payment option:",
        this.checked ? "enabled" : "disabled"
      );
    });
  }
}

// Handle billing portal (placeholder)
function handleBillingPortal() {
  const billingLink = document.querySelector(
    'a[href="#"].text-decoration-none.text-primary'
  );
  if (billingLink) {
    billingLink.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Billing portal integration would go here");
    });
  }
}

// Handle refresh credits
function handleRefreshCredits() {
  const userId = localStorage.getItem("userId");
  if (userId) {
    getUserCredits(userId).then((credits) => {
      if (credits !== null) {
        updateCreditsDisplay(credits);
        fetchAndRenderCreditHistory(userId);
      }
    });
  }
}

// Init
document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem("userId");

  if (userId) {
    getUserCredits(userId).then((credits) => {
      if (credits !== null) updateCreditsDisplay(credits);
    });

    fetchAndRenderCreditHistory(userId, currentPage);
  }

  document
    .getElementById("addCreditsBtn")
    ?.addEventListener("click", handleAddCredits);
  document
    .getElementById("confirmAddCredits")
    ?.addEventListener("click", handleConfirmAddCredits);
  document.getElementById("refreshCredits")?.addEventListener("click", () => {
    handleRefreshCredits();
    fetchAndRenderCreditHistory(userId, 1);
    currentPage = 1;
  });

  handleCryptoSwitch();
  handleBillingPortal();
});
