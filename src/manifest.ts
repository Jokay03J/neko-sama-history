import pkg from "../package.json";
import _ from "dotenv";
_.configDotenv();

const IS_FIREFOX = process.env.PLATFORM_TARGET === "firefox";
const manifest = {
  action: {
    default_icon: {
      16: "icons/16.png",
      19: "icons/19.png",
      32: "icons/32.png",
      38: "icons/38.png",
    },
    default_popup: "src/entries/popup/index.html",
  },
  background: {
    service_worker: "src/entries/background/main.ts",
    scripts: ["src/entries/background/main.ts"],
  },
  content_scripts: [
    {
      js: ["src/entries/contentScript/main.tsx"],
      matches: ["https://neko-sama.fr/*/*"],
    },
  ],
  host_permissions: ["https://neko-sama.fr/*/*"],
  icons: {
    16: "icons/16.png",
    19: "icons/19.png",
    32: "icons/32.png",
    38: "icons/38.png",
    48: "icons/48.png",
    64: "icons/64.png",
    96: "icons/96.png",
    128: "icons/128.png",
    256: "icons/256.png",
    512: "icons/512.png",
  },
  options_ui: {
    page: "src/entries/options/index.html",
    open_in_tab: true,
  },
  browser_specific_settings: {
    gecko: {
      id: "neko-sama-history@jokay03j.fr",
      strict_min_version: "109.0",
    },
  },
};

export function getManifest(): chrome.runtime.ManifestV3 {
  if (!IS_FIREFOX) {
    Reflect.deleteProperty(manifest.background, "scripts");
  } else {
    Reflect.deleteProperty(manifest.background, "type");
    Reflect.deleteProperty(manifest.background, "service_worker");
  }

  return {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName,
    version: pkg.version,
    manifest_version: 3,
    permissions: ["storage", "unlimitedStorage"],
    ...manifest,
  };
}
