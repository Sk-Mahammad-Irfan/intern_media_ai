// Get user credits
async function getUserCredits(userId) {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(`${BACKEND_URL}/api/credits/credits/${userId}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

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
async function getCreditHistory(userId) {
  try {
    const token = getAuthToken();
    if (!token) return [];

    const response = await fetch(`${BACKEND_URL}/api/credits/history/${userId}`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.success ? data.history : [];
  } catch (error) {
    console.error("Error fetching credit history:", error);
    return [];
  }
}

// Render credit history
async function fetchAndRenderCreditHistory(userId) {
  const history = await getCreditHistory(userId);
  const container = document.getElementById("creditHistoryContainer");
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = `<p>No credit history found.</p>`;
    return;
  }

  container.innerHTML = history
    .map((entry) => {
      const date = new Date(entry.createdAt).toLocaleString();
      return `<div class="border-bottom py-2">
        <strong>${entry.amount} credits</strong> via <em>${entry.method}</em> on ${date}
      </div>`;
    })
    .join("");
}

// Update credits text
function updateCreditsDisplay(credits) {
  const creditsElement = document.querySelector(".display-4.fw-bold.text-dark");
  if (creditsElement) creditsElement.textContent = credits;
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

  const addCreditsModal = new bootstrap.Modal(document.getElementById("addCreditsModal"));
  addCreditsModal.show();
}

// Handle confirm button
function handleConfirmAddCredits() {
  const userId = localStorage.getItem("userId");
  const amountInput = document.getElementById("creditAmount");
  const cryptoSwitch = document.getElementById("cryptoSwitch");

  if (!userId) {
    alert("Please log in to add credits");
    return;
  }

  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid positive number");
    return;
  }

  const method = cryptoSwitch?.checked ? "crypto" : "card";

  updateUserCredits(userId, amount, method);

  // Close modal
  const addCreditsModal = bootstrap.Modal.getInstance(document.getElementById("addCreditsModal"));
  addCreditsModal.hide();
  amountInput.value = "";
}

// Handle crypto switch (placeholder)
function handleCryptoSwitch() {
  const cryptoSwitch = document.getElementById("cryptoSwitch");
  if (cryptoSwitch) {
    cryptoSwitch.addEventListener("change", function () {
      console.log("Crypto payment option:", this.checked ? "enabled" : "disabled");
    });
  }
}

// Handle billing portal (placeholder)
function handleBillingPortal() {
  const billingLink = document.querySelector('a[href="#"].text-decoration-none.text-primary');
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
    fetchAndRenderCreditHistory(userId);
  }

  document.getElementById("addCreditsBtn")?.addEventListener("click", handleAddCredits);
  document.getElementById("confirmAddCredits")?.addEventListener("click", handleConfirmAddCredits);
  document.getElementById("refreshCredits")?.addEventListener("click", handleRefreshCredits);

  handleCryptoSwitch();
  handleBillingPortal();
});
