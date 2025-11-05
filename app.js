const spotifyLink = "https://open.spotify.com/";
const appUri = "spotify://";

const openButton = document.querySelector("#open-spotify");
const webLink = document.querySelector("#open-web");
const hint = document.querySelector("#hint");

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
