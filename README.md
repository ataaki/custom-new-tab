# Custom New Tab

A Firefox extension that replaces the **new tab** page with the web page of your choice,
shown full-screen — while keeping the **search bar empty and already focused** the moment
the tab opens, so you can type a search immediately, with nothing to select or delete.

The page address is **fully configurable** in the extension's settings.

## Why it works (the idea)

No Firefox extension can clear or select the text in the address bar (the browser locks
that down). So the trick is to **never put any text there**:

- The new tab page is a **local** page of the extension (`moz-extension://`). Firefox treats
  it like the native "new tab" page → the address bar stays **empty + focused**.
- The chosen page is shown **inside a full-screen `<iframe>`** within that local page. The
  "real" document stays the local page, so the page's URL **never** appears in the bar.

## Usage

1. Install the extension.
2. On the first new tab, click **"Open settings"** (or go to `about:addons` → the extension
   → **Preferences**).
3. Enter your page address (`https://…` recommended) and **Save**.
4. Open a new tab: your page appears, and the search bar is empty and focused.

> An `http://` page may be blocked by Firefox inside a secure frame. In that case the
> extension shows a link to open the page directly. Prefer `https://`.

## Files

| File | Role |
|---|---|
| `manifest.json` | Declares the new tab override, the settings page, the `storage` permission |
| `newtab.html` / `newtab.css` / `newtab.js` | The new tab page (iframe + setup/fallback states) |
| `options.html` / `options.css` / `options.js` | The settings page (URL input) |
| `icons/icon.svg` | Extension icon |

Only one piece of data is stored, **locally** (`storage.local`): the `dashboardUrl` key.
Nothing is sent anywhere (`data_collection_permissions: none`).

## Develop / test locally

```
about:debugging#/runtime/this-firefox → "Load Temporary Add-on…" → select manifest.json
```

## Publish on addons.mozilla.org (AMO)

The extension is ready for AMO review: minimal permission (`storage` only, no host
permissions) and no declared data collection.

1. **Personalize before submitting** (see the next section): name, id, description.
2. Build the package:
   ```bash
   cd custom-new-tab
   zip -r -FS ../custom-new-tab.zip . -x '*.DS_Store' 'README.md'
   ```
3. Go to <https://addons.mozilla.org/developers/> → **Submit a New Add-on** → choose
   **listed** (visible in the catalog) or **unlisted** (private distribution).
4. Upload the `.zip`. For a *listed* submission, a reviewer may inspect the code. Useful
   points to include in the notes to the reviewer:
   - The extension loads **a user-entered URL** in an `<iframe>`; no remote code is executed
     as extension code.
   - No data is collected or transmitted; only `storage.local` keeps the URL.

### To personalize before publishing

- `manifest.json` → `name`: pick a **unique** name (check it doesn't already exist on AMO).
- `manifest.json` → `browser_specific_settings.gecko.id`: use your own identifier
  (e.g. `extension-name@your-domain`). You can also omit the `id` to let AMO generate one.
- `manifest.json` → `description`: tweak to taste.

### Private permanent install (without publishing)

- **Unlisted signing** (regular Firefox, without going through the catalog):
  ```bash
  npm i -g web-ext
  web-ext sign --channel=unlisted --api-key="YOUR_JWT_ISSUER" --api-secret="YOUR_JWT_SECRET"
  ```
  Produces a signed `.xpi` you can install permanently.
- **Firefox Developer Edition / ESR / Nightly**: `about:config` →
  `xpinstall.signatures.required = false`, then install the `.zip`.

## Known limitations

- **Certificate** — if the page uses a certificate not trusted by Firefox, the iframe stays
  blank and the fallback screen is shown.
- **Focus stealing** — if the target page focuses its own field on load, it will "steal"
  focus from the address bar (an extension cannot force it back).
