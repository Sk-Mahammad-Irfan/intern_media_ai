document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:5000/api/usage/stats");
    const result = await response.json();

    if (!result.success) throw new Error("Failed to load data");

    // Sort data by count descending (most used at top)
    const sortedData = result.data.sort((a, b) => b.count - a.count);

    const labels = sortedData.map((item) => item.model);
    const counts = sortedData.map((item) => item.count);

    const ctx = document.getElementById("usageChart").getContext("2d");

    new Chart(ctx, {
      type: "bar", // default vertical bar
      data: {
        labels,
        datasets: [
          {
            label: "Usage Count",
            data: counts,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "AI Model Usage Count",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("Error loading chart data:", err);
    alert("Failed to load chart data.");
  }
});
