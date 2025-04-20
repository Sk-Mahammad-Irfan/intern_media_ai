function handleModelChange() {
  const selected = document.getElementById("modelSelector").value;

  if (selected === "video") {
    window.location.href = "videomodel.html";
  } else if (selected === "image") {
    window.location.href = "imagemodel.html";
  } else if (selected === "audio") {
    // Stay on current page (or redirect to audiomodel.html if needed)
    // window.location.href = "audiomodel.html";
  }
}
