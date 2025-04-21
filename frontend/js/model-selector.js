function handleModelChange() {
  const selected = document.getElementById("modelSelector").value;

  if (selected === "image" || selected === "video" || selected === "audio") {
    window.location.href = `${selected}model.html`;
  }
}
