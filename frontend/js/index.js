document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', function() {
          selectedModel = card.getAttribute('data-model');

          // Highlight the selected card (optional visual feedback)
          document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        });
      });

      document.getElementById("submitPrompt").addEventListener("click", function () {
        const prompt = document.querySelector(".model-prompt-box input").value.trim();

        if (!selectedModel) {
          alert("Please select a model first.");
          return;
        }

        if (!prompt) {
          alert("Please enter a prompt.");
          return;
        }

        // Determine the correct page based on model type
        let page = "imagemodel.html"; // Default
        if (document.querySelector(`.model-card[data-model="${selectedModel}"]`).classList.contains("video-model")) {
          page = "videomodel.html";
        } else if (document.querySelector(`.model-card[data-model="${selectedModel}"]`).classList.contains("audio-model")) {
          page = "audiomodel.html";
        }

        // Redirect to the correct page with model ID and prompt
        window.location.href = `${page}?id=${selectedModel}&prompt=${encodeURIComponent(prompt)}`;
      });