document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/usage/stats`);
    const result = await res.json();
    if (!result.success) throw new Error("Failed to load data");

    const allData = result.data.sort((a, b) => b.count - a.count);

    const modelCategoryMap = {
      /* audio */
      "stackadoc-stable-audio": "audio",
      "multilingual-audio": "audio",
      "cassetteai-sfx-generator": "audio",
      "american-audio": "audio",
      "fal-ai-kokoro-hindi": "audio",
      "fal-ai-elevenlabs-sound-effects": "audio",
      "fal-ai-lyria2": "audio",
      "fal-ai-mmaudio-v2-text-to-audio": "audio",
      /* image */
      "black-forest-labs-flux-1-1-pro": "image",
      "recraft-v3": "image",
      "ideogram-v3": "image",
      "hidream-i1-dev": "image",
      fooocus: "image",
      "imagen4-preview": "image",
      "sana-v1.5-4.8b": "image",
      bagel: "image",
      "minimax-image-01": "image",
      "f-lite-standard": "image",
      /* video */
      "lightricks-ltx-video": "video",
      "pixverse-v4-text-to-video": "video",
      "wan-ai-wan21-t2v-13b": "video",
      "pika-text-to-video-v2-1": "video",
      CogVideoX: "video",
      "kling-video-v2-master": "video",
      magi: "video",
      "vidu-q1": "video",
      "luma-ray2-flash": "video",
      veo2: "video",
    };

    const leaderboardList = document.getElementById("leaderboard-list");
    function renderLeaderboard(data) {
      leaderboardList.innerHTML = "";
      data.forEach((item, idx) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-start";
        li.innerHTML = `
          <div class="ms-2 me-auto">
            <div class="fw-semibold">${idx + 1}. ${item.model}</div>
          </div>
          <span class="badge rounded-pill bg-primary-subtle text-dark">
            ${item.count} uses
          </span>
        `;
        leaderboardList.appendChild(li);
      });
    }
    renderLeaderboard(allData);

    // Chart setup
    const ctx = document.getElementById("usageChart").getContext("2d");
    let usageChart;

    function updateChart(filteredData) {
      //  Re-render leaderboard
      renderLeaderboard(filteredData);

      //  Aggregate totals per category
      const categories = ["audio", "image", "video"];
      const totals = { audio: 0, image: 0, video: 0 };
      filteredData.forEach(({ model, count }) => {
        const cat = modelCategoryMap[model];
        if (cat) totals[cat] += count;
      });

      //  Compute chunking (10-unit slices)
      const chunkSize = 10;
      const maxChunks = Math.max(
        ...categories.map((cat) => Math.ceil(totals[cat] / chunkSize))
      );

      // Build one dataset per chunk
      const palette = [
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
      const chunkDatasets = Array.from({ length: maxChunks }, (_, i) => ({
        label: `${i * chunkSize + 1}–${(i + 1) * chunkSize}`,
        data: categories.map((cat) => {
          const remaining = totals[cat] - i * chunkSize;
          return remaining > 0 ? Math.min(chunkSize, remaining) : 0;
        }),
        backgroundColor: palette[i % palette.length],
        borderRadius: 4,
      }));

      // X-axis labels: “Image (100)”, etc.
      const labels = categories.map((cat) => {
        const pretty = cat.charAt(0).toUpperCase() + cat.slice(1);
        return `${pretty} (${totals[cat]})`;
      });

      // Destroy old and draw new
      if (usageChart) usageChart.destroy();
      usageChart = new Chart(ctx, {
        type: "bar",
        data: { labels, datasets: chunkDatasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top" },
            tooltip: {
              callbacks: {
                label: ({ raw }) => `${raw} uses`,
              },
            },
          },
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true },
          },
        },
      });
    }

    // Wire up filter dropdown
    document
      .getElementById("categoryFilter")
      .addEventListener("change", (e) => {
        const sel = e.target.value;
        const filtered =
          sel === "all"
            ? allData
            : allData.filter(
                (item) => (modelCategoryMap[item.model] || "unknown") === sel
              );
        updateChart(filtered);
      });

    // Initial draw
    updateChart(allData);
  } catch (err) {
    console.error(err);
    alert("Failed to load data.");
  }
});
