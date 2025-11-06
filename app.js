const DEFAULT_EMBED =
  "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M";
const SPOTIFY_HOST = "open.spotify.com";

const frame = document.querySelector("#player-frame");
const form = document.querySelector("#link-form");
const input = document.querySelector("#spotify-url");
const hint = document.querySelector("#hint");
const resetButton = document.querySelector("#reset");

function normaliseSpotifyValue(raw) {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  if (value.startsWith("spotify:")) {
    const parts = value.split(":").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }
    const pathParts = parts.slice(1);
    return `https://${SPOTIFY_HOST}/embed/${pathParts.join("/")}`;
  }

  try {
    const url = new URL(value);
    if (!url.hostname.endsWith(SPOTIFY_HOST)) {
      return null;
    }

    const path = url.pathname.replace(/\/$/, "");
    if (!path || path === "/") {
      return null;
    }

    if (path.startsWith("/embed")) {
      return `https://${SPOTIFY_HOST}${path}`;
    }

    return `https://${SPOTIFY_HOST}/embed${path}`;
  } catch (error) {
    return null;
  }
}

function setFrameSource(src) {
  if (!frame) return;
  frame.src = src;
}

function showHint(message, tone = "info") {
  if (!hint) return;
  hint.textContent = message;
  hint.dataset.tone = tone;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const candidate = normaliseSpotifyValue(input?.value ?? "");

  if (!candidate) {
    showHint(
      "Kunne ikke forstå linket. Brug et Spotify-delingslink eller en URI (fx spotify:playlist:ID).",
      "error"
    );
    return;
  }

  setFrameSource(candidate);
  showHint("Spotify-indholdet er indlæst i rammen.");
  input?.select();
});

resetButton?.addEventListener("click", () => {
  setFrameSource(DEFAULT_EMBED);
  if (input) {
    input.value = "";
  }
  showHint(
    "Standardplaylisten er indlæst igen. Indsæt et link for at skifte indhold.",
    "info"
  );
});

if (frame) {
  setFrameSource(DEFAULT_EMBED);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((error) => console.error("SW registration failed", error));
  });
}
