// Settings page: reads and writes the single stored key, `dashboardUrl`.

const input = document.getElementById("url");
const form = document.getElementById("form");
const status = document.getElementById("status");

// Only allow http(s) — blocks javascript:, data:, file:, etc.
function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function show(message, kind) {
  status.textContent = message;
  status.className = kind;
}

async function load() {
  const { dashboardUrl } = await browser.storage.local.get("dashboardUrl");
  if (dashboardUrl) {
    input.value = dashboardUrl;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = input.value.trim();

  if (!isValidUrl(url)) {
    show("Invalid URL — it must start with http:// or https://", "error");
    return;
  }

  await browser.storage.local.set({ dashboardUrl: url });
  show("✓ Saved. Open a new tab to see the result.", "ok");
});

load();
