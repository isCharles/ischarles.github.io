const html = document.documentElement;
const dialog = document.querySelector("#shot-dialog");
const image = document.querySelector("#shot-image");
const title = document.querySelector("#shot-title");
const zoom = document.querySelector("#shot-zoom");
const close = document.querySelector("#shot-close");
const toggle = document.querySelector("#lang-toggle");
const metaDescription = document.querySelector('meta[name="description"]');
const ogTitle = document.querySelector('meta[property="og:title"]');
const ogDescription = document.querySelector('meta[property="og:description"]');

const copy = {
  zh: {
    title: "Ardor — AI 求职工作台 · Charles Yang",
    description: "Ardor 是一个 AI 求职工作台：把简历、面试记录、学习练习和日历连成一条可以继续的准备路径。浏览真实产品界面，无需登录。",
    ogTitle: "Ardor — 把求职过程，变成下一次准备的起点",
    ogDescription: "保存求职与面试记录，把薄弱点带进学习，再让 Agent 把下一步执行出来。浏览真实产品界面，无需登录。",
    toggleLabel: "切换为英文",
    zoom: "原始尺寸",
    fit: "适应窗口",
    close: "关闭"
  },
  en: {
    title: "Ardor — AI career workspace · Charles Yang",
    description: "Ardor is an AI career workspace that connects your resume, interview notes, learning practice and calendar into one preparation path. Browse the real product UI without signing in.",
    ogTitle: "Ardor — Turn your job search into your next preparation",
    ogDescription: "Keep your applications and interviews, turn weak spots into learning, then let the agent execute the next step. Browse the real product UI without signing in.",
    toggleLabel: "Switch to Chinese",
    zoom: "Original size",
    fit: "Fit to window",
    close: "Close"
  }
};

let lang = html.lang === "en" ? "en" : "zh";
let activeShot = null;

function localized(element, part) {
  return element.getAttribute(`data-${lang}-${part}`) ?? "";
}

function shotSource(button) {
  return button.getAttribute(`data-${lang}-src`) ?? button.dataset.src;
}

function syncShotSource(button) {
  const thumbnail = button.querySelector("img");
  if (thumbnail) thumbnail.src = shotSource(button);
}

function syncDialogText() {
  close.textContent = copy[lang].close;
  zoom.textContent = dialog.classList.contains("is-zoomed") ? copy[lang].fit : copy[lang].zoom;
}

function syncShotText(button) {
  const thumbnail = button.querySelector("img");
  title.textContent = localized(button, "title");
  image.alt = thumbnail ? localized(thumbnail, "alt") : "";
}

function applyLanguage(next, persist = false) {
  lang = next;
  html.lang = lang === "en" ? "en" : "zh-CN";
  document.title = copy[lang].title;
  metaDescription.setAttribute("content", copy[lang].description);
  ogTitle.setAttribute("content", copy[lang].ogTitle);
  ogDescription.setAttribute("content", copy[lang].ogDescription);
  toggle.textContent = lang === "zh" ? "EN" : "中文";
  toggle.setAttribute("aria-label", copy[lang].toggleLabel);
  toggle.setAttribute("title", copy[lang].toggleLabel);
  for (const element of document.querySelectorAll("[data-zh-label]")) {
    element.setAttribute("aria-label", localized(element, "label"));
  }
  for (const thumbnail of document.querySelectorAll("[data-zh-alt]")) {
    thumbnail.alt = localized(thumbnail, "alt");
  }
  for (const button of document.querySelectorAll(".shot-open")) syncShotSource(button);
  syncDialogText();
  if (activeShot) {
    image.src = shotSource(activeShot);
    syncShotText(activeShot);
  }
  if (persist) {
    try {
      localStorage.setItem("ardor-lang", lang);
    } catch {
      // Storage can be unavailable in private or embedded contexts.
    }
  }
}

function openShot(button) {
  activeShot = button;
  image.src = shotSource(button);
  syncShotText(button);
  dialog.classList.remove("is-zoomed");
  syncDialogText();
  dialog.showModal();
}

function toggleZoom() {
  dialog.classList.toggle("is-zoomed");
  syncDialogText();
}

toggle.addEventListener("click", () => applyLanguage(lang === "zh" ? "en" : "zh", true));

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
  activeShot = null;
});

applyLanguage(lang);
