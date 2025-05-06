// Function to get user credits
async function getUserCredits(userId) {
  try {
    const token = document.cookie.includes("token=")
      ? document.cookie.split("token=")[1].split(";")[0]
      : null;
    if (!token) {
      console.error("No authentication token found in cookies");
      return null;
    }

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

    if (data.success) {
      return data.credits;
    } else {
      console.error("Failed to get credits:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error getting credits:", error);
    return null;
  }
}

// Function to update user credits
async function updateUserCredits(userId, amount) {
  try {
    const token = document.cookie.includes("token=")
      ? document.cookie.split("token=")[1].split(";")[0]
      : null;
    if (!token) {
      console.error("No authentication token found in cookies");
      return null;
    }

    const response = await fetch(
      `${BACKEND_URL}/api/credits/updatecredits`,
      {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          amount,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      // Update the credits display on the page
      updateCreditsDisplay(data.user.credits);
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

// Function to update the credits display on the page
function updateCreditsDisplay(credits) {
  const creditsElement = document.querySelector(".display-4.fw-bold.text-dark");
  if (creditsElement) {
    creditsElement.textContent = credits;
  }
}

// Function to handle the "Add Credits" button click
function handleAddCredits() {
  // Get the current user ID from localStorage or session
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please log in to add credits");
    return;
  }

  // Show the modal
  const addCreditsModal = new bootstrap.Modal(
    document.getElementById("addCreditsModal")
  );
  addCreditsModal.show();
}

// Function to handle the "Confirm Add Credits" button click
function handleConfirmAddCredits() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please log in to add credits");
    return;
  }

  const amountInput = document.getElementById("creditAmount");
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid positive number");
    return;
  }

  // Update the credits
  updateUserCredits(userId, amount);

  // Close the modal
  const addCreditsModal = bootstrap.Modal.getInstance(
    document.getElementById("addCreditsModal")
  );
  addCreditsModal.hide();

  // Reset the form
  amountInput.value = "";
}

// Function to handle the "Use crypto" switch
function handleCryptoSwitch() {
  const cryptoSwitch = document.getElementById("cryptoSwitch");
  if (cryptoSwitch) {
    cryptoSwitch.addEventListener("change", function () {
      // This is a placeholder for crypto payment integration
      console.log(
        "Crypto payment option:",
        this.checked ? "enabled" : "disabled"
      );
    });
  }
}

// Function to handle the "Open Billing Portal" link
function handleBillingPortal() {
  const billingLink = document.querySelector(
    'a[href="#"].text-decoration-none.text-primary'
  );
  if (billingLink) {
    billingLink.addEventListener("click", function (e) {
      e.preventDefault();
      // This is a placeholder for billing portal integration
      alert("Billing portal integration would go here");
    });
  }
}

// Function to handle the refresh button
function handleRefreshCredits() {
  const userId = localStorage.getItem("userId");
  if (userId) {
    getUserCredits(userId).then((credits) => {
      if (credits !== null) {
        updateCreditsDisplay(credits);
      }
    });
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  // Get the current user ID from localStorage or session
  const userId = localStorage.getItem("userId");
  if (userId) {
    // Load the user's credits
    getUserCredits(userId).then((credits) => {
      if (credits !== null) {
        updateCreditsDisplay(credits);
      }
    });
  }

  // Add event listeners
  const addCreditsButton = document.getElementById("addCreditsBtn");
  if (addCreditsButton) {
    addCreditsButton.addEventListener("click", handleAddCredits);
  }

  // Add confirm button event listener
  const confirmAddCreditsButton = document.getElementById("confirmAddCredits");
  if (confirmAddCreditsButton) {
    confirmAddCreditsButton.addEventListener("click", handleConfirmAddCredits);
  }

  // Add refresh button event listener
  const refreshButton = document.getElementById("refreshCredits");
  if (refreshButton) {
    refreshButton.addEventListener("click", handleRefreshCredits);
  }

  handleCryptoSwitch();
  handleBillingPortal();
});
