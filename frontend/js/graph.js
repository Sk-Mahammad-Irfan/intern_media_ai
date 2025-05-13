document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:5000/api/usage/stats");
    const result = await response.json();

    if (!result.success) throw new Error("Failed to load data");

    const sortedData = result.data.sort((a, b) => b.count - a.count);
    const labels = sortedData.map((item) => item.model);
    const counts = sortedData.map((item) => item.count);

    const softColors = [
      "#a5b4fc", "#6ee7b7", "#fde68a", "#fca5a5", "#c4b5fd",
      "#93c5fd", "#fbcfe8", "#5eead4", "#ddd6fe", "#fcd34d"
    ];

    const ctx = document.getElementById("usageChart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Usage Count",
          data: counts,
          backgroundColor: softColors,
          borderRadius: 10,
          hoverBackgroundColor: softColors.map(c => c + "cc")
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Model Usage Count",
            color: "#1f2937",
            font: {
              size: 20,
              weight: "600",
              family: "Inter, sans-serif"
            },
            padding: { top: 5, bottom: 15 }
          },
          tooltip: {
            backgroundColor: "#f9fafb",
            titleColor: "#111827",
            bodyColor: "#374151",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            titleFont: { weight: "600" },
            displayColors: false,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.parsed.y} uses`
            }
          }
        },
        scales: {
          x: {
            ticks: {
  color: "#4b5563",
  font: { size: 11 }, // Reduce size
  maxRotation: 0,     // Keep horizontal
  minRotation: 0,
  callback: function (value) {
    return value.length > 12 ? value.slice(0, 12) + "…" : value; // optional trimming
  }
}
,
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#6b7280",
              stepSize: 1,
              precision: 0
            },
            grid: {
              color: "#f3f4f6",
              lineWidth: 1
            }
          }
        }
      }
    });

    // Leaderboard rendering
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = '';
    sortedData.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-start";
      li.innerHTML = `
        <div class="ms-2 me-auto">
          <div class="fw-semibold text-dark">${index + 1}. ${item.model}</div>
          
        </div>
        <span class="badge rounded-pill bg-primary-subtle text-dark">
          ${item.count} uses
        </span>
      `;
      leaderboardList.appendChild(li);
    });

  } catch (err) {
    console.error("Error loading data:", err);
    alert("Failed to load data.");
  }
});
