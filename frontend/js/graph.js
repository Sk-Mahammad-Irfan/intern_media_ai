document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/usage/stats`);
    const result = await response.json();

    if (!result.success) throw new Error("Failed to load data");

    const allData = result.data.sort((a, b) => b.count - a.count);

    // Map each model to a category
    const modelCategoryMap = {
      "stackadoc-stable-audio": "audio",
      "multilingual-audio": "audio",
      "black-forest-labs-flux-1-1-pro": "image",
      "lightricks-ltx-video": "video",
      "pixverse-v4-text-to-video": "video",
      "cassetteai-sfx-generator": "audio",
      "wan-ai-wan21-t2v-13b": "video",
      "recraft-v3": "image",
      "american-audio": "audio",
      "ideogram-v3": "image",
      "hidream-i1-dev": "image",
      fooocus: "image",
      "luma-ray2-flash": "video",
      "pika-text-to-video-v2-1": "video",
      "cassattemusic-audio": "audio",
      CogVideoX: "video",
      "kling-video-v2-master": "video",
      magi: "video",
      "vidu-q1": "video",
      "imagen4-preview": "image",
      "sana-v1.5-4.8b": "image",
      "fal-ai-kokoro-hindi": "audio",
      "fal-ai-elevenlabs-sound-effects": "audio",
      "fal-ai-lyria2": "audio",
      "fal-ai-mmaudio-v2-text-to-audio": "audio",
      bagel: "image",
      "minimax-image-01": "image",
      "f-lite-standard": "image",
      veo2: "video",
      // add more as needed
    };

    const leaderboardList = document.getElementById("leaderboard-list");

    const renderLeaderboard = (data) => {
      leaderboardList.innerHTML = "";
      data.forEach((item, index) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-start";
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
    };

    renderLeaderboard(allData);

    // Handle category filter
    document
      .getElementById("categoryFilter")
      .addEventListener("change", (e) => {
        const selected = e.target.value;

        const filteredData =
          selected === "all"
            ? allData
            : allData.filter((item) => {
                // Get category from map, default unknown
                const category = modelCategoryMap[item.model] || "unknown";
                return category === selected;
              });

        renderLeaderboard(filteredData);
        updateChart(filteredData);
      });

    // Initial chart render with all data
    const ctx = document.getElementById("usageChart").getContext("2d");
    let usageChart;

    const updateChart = (data) => {
      const sortedData = data.slice().sort((a, b) => b.count - a.count);
      const labels = sortedData.map((item, idx) => `${idx + 1}`);
      const counts = sortedData.map((item) => item.count);

      const softColors = [
        "#a5b4fc",
        "#6ee7b7",
        "#fde68a",
        "#fca5a5",
        "#c4b5fd",
        "#93c5fd",
        "#fbcfe8",
        "#5eead4",
        "#ddd6fe",
        "#fcd34d",
      ];

      if (usageChart) usageChart.destroy();

      usageChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Usage Count",
              data: counts,
              backgroundColor: softColors,
              borderRadius: 10,
              hoverBackgroundColor: softColors.map((c) => c + "cc"),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Model Rankings",
              color: "#1f2937",
              font: {
                size: 20,
                weight: "600",
                family: "Inter, sans-serif",
              },
              padding: { top: 5, bottom: 15 },
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
              position: "nearest",
              intersect: false,
              callbacks: {
                title: (context) => {
                  const index = context[0].dataIndex;
                  return sortedData[index].model;
                },
                label: (context) => {
                  return `${context.parsed.y} uses`;
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: false,
              ticks: {
                color: "#4b5563",
                font: { size: 11 },
                maxRotation: 0,
                minRotation: 0,
              },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: "#6b7280",
                stepSize: 1,
                precision: 0,
              },
              grid: {
                color: "#f3f4f6",
                lineWidth: 1,
              },
            },
          },
        },
      });
    };

    updateChart(allData);
  } catch (err) {
    console.error("Error loading data:", err);
    alert("Failed to load data.");
  }
});
