const dialog = document.querySelector("#shot-dialog");
const image = document.querySelector("#shot-image");
const title = document.querySelector("#shot-title");
const zoom = document.querySelector("#shot-zoom");
const close = document.querySelector("#shot-close");

function openShot(button) {
  const thumbnail = button.querySelector("img");
  image.src = button.dataset.src;
  image.alt = thumbnail?.alt ?? "";
  title.textContent = button.dataset.title ?? "";
  dialog.classList.remove("is-zoomed");
  zoom.textContent = "原始尺寸";
  dialog.showModal();
}

function toggleZoom() {
  const zoomed = dialog.classList.toggle("is-zoomed");
  zoom.textContent = zoomed ? "适应窗口" : "原始尺寸";
}

for (const button of document.querySelectorAll(".shot-open")) {
  button.addEventListener("click", () => openShot(button));
}

zoom.addEventListener("click", toggleZoom);
close.addEventListener("click", () => dialog.close());
image.addEventListener("dblclick", toggleZoom);
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => {
  image.removeAttribute("src");
  dialog.classList.remove("is-zoomed");
});
