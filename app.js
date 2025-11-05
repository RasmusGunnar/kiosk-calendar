const spotifyLink = "https://open.spotify.com/";
const appUri = "spotify://";

const openButton = document.querySelector("#open-spotify");
const webLink = document.querySelector("#open-web");
const hint = document.querySelector("#hint");
const returnButton = document.querySelector("#return-app");

function resolveReturnTarget() {
  const params = new URLSearchParams(window.location.search);
  const candidate =
    params.get("returnUrl") || params.get("return") || params.get("back");

  if (candidate) {
    try {
      const asUrl = new URL(candidate, window.location.href);

      if (["http:", "https:"].includes(asUrl.protocol)) {
        return asUrl.toString();
      }
      return null;
    } catch (error) {
      console.warn("Ugyldig returnUrl", error);
      return null;
    }
  }

  if (document.referrer) {
    return document.referrer;
  }

  return null;
}

function openNativeApp() {
  hint.textContent = "Forsøger at starte Spotify…";

  const start = Date.now();
  let didLaunch = false;

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = appUri;
  document.body.appendChild(iframe);

  setTimeout(() => {
    const elapsed = Date.now() - start;
    if (elapsed < 1600) {
      didLaunch = true;
    }

    iframe.remove();

    if (!didLaunch) {
      hint.textContent = "Kunne ikke åbne den native app – webafspilleren er åbnet i en ny fane.";
      window.open(spotifyLink, "_blank", "noopener");
    } else {
      hint.textContent = "Hvis Spotify ikke åbner, brug knappen til webafspilleren.";
    }
  }, 1400);
}

openButton?.addEventListener("click", () => {
  openNativeApp();
});

const returnTarget = resolveReturnTarget();

if (returnButton) {
  if (returnTarget) {
    try {
      const parsed = new URL(returnTarget);
      const isSameOrigin = parsed.origin === window.location.origin;
      const hostLabel = isSameOrigin
        ? "kiosken"
        : parsed.host || parsed.href || "kiosken";
      returnButton.hidden = false;
      returnButton.textContent = isSameOrigin
        ? "Tilbage til kiosken"
        : `Tilbage til ${hostLabel}`;
      returnButton.addEventListener("click", () => {
        window.location.href = returnTarget;
      });
    } catch (error) {
      console.warn("Kunne ikke læse returnUrl", error);
    }
  } else if (window.history.length > 1) {
    returnButton.hidden = false;
    returnButton.addEventListener("click", () => window.history.back());
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((error) => console.error("SW registration failed", error));
  });
}

webLink?.addEventListener("click", () => {
  hint.textContent = "Webafspilleren åbnes i en ny fane.";
});
