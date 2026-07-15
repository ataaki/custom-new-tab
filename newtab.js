// New tab page.
//
// Important: this script NEVER moves focus to an element on the page.
// That's intentional — focus is left on Firefox's address bar, so you can
// type your search right away, with nothing to clear.

const iframe = document.getElementById("dashboard");
const fallback = document.getElementById("fallback");
const fallbackLink = document.getElementById("fallback-link");
const setup = document.getElementById("setup");
const openOptionsBtn = document.getElementById("open-options");
const settings = document.getElementById("settings");

openOptionsBtn.addEventListener("click", () => {
  browser.runtime.openOptionsPage();
});

settings.addEventListener("click", () => {
  browser.runtime.openOptionsPage();
});

// Only allow http(s) — blocks javascript:, data:, file:, etc.
function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function init() {
  const { dashboardUrl } = await browser.storage.local.get("dashboardUrl");

  // No valid URL configured → offer the settings page.
  if (!isValidUrl(dashboardUrl)) {
    setup.hidden = false;
    return;
  }

  // Fallback ready (behind the iframe) in case loading fails.
  fallbackLink.textContent = dashboardUrl;
  fallbackLink.href = dashboardUrl;
  fallback.hidden = false;

  // Hide the fallback as soon as the page has loaded.
  iframe.addEventListener("load", () => {
    fallback.hidden = true;
  });

  iframe.src = dashboardUrl;
  iframe.hidden = false;
  settings.hidden = false;

  // Safety net: if nothing has loaded after 5s, bring the fallback to the front.
  setTimeout(() => {
    if (!fallback.hidden) {
      fallback.style.zIndex = "2";
    }
  }, 5000);
}

init();
