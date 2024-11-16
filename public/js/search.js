const frame = document.querySelector("iframe");
const div = document.querySelector(".search-container");
const versionDiv = document.querySelector(".version");
const loadingScreen = document.querySelector(".loading-screen");
const navbar = document.querySelector(".navbar");
const searchInput1 = document.getElementById("searchInput");
const searchInput2 = document.getElementById("searchInputt");
const searchEngineSelect = document.getElementById("searchEngineSelect");

navbar.style.display = "none";
versionDiv.style.display = "block";
frame.style.display = "none";
searchInput2.style.display = "block";

// Default search engine
const defaultEngine = localStorage.getItem("searchEngine") || "google";
updateSearchEngine(defaultEngine);

const searchInputs = [searchInput1, searchInput2];
searchInputs.forEach(input => {
    input.addEventListener("keyup", event => {
        if (event.key === "Enter") {
            handleSearch(input.value);
        }
    });
});

// Handle search engine change
searchEngineSelect.addEventListener("change", event => {
    const selectedEngine = event.target.value;
    localStorage.setItem("searchEngine", selectedEngine);
    updateSearchEngine(selectedEngine);
});

// Function to handle search
async function handleSearch(query) {
    showLoadingScreen();
    div.style.display = "none";
    frame.style.display = "block";
    versionDiv.style.display = "none";
    searchEngineSelect.style.display = "none"; 

    const searchURL = search(query);
    frame.src = await getUrlWithDelay(searchURL);

    frame.onload = () => {
        hideLoadingScreen();
        navbar.style.display = "block";
    };
}

// Determine if input is a URL or query
function search(input) {
    try {
        return new URL(input).toString(); // Valid URL
    } catch (err) {}

    try {
        const url = new URL(`http://${input}`);
        if (url.hostname.includes(".")) return url.toString(); // Valid URL
    } catch (err) {}

    // Treat input as a search query
    const engine = localStorage.getItem("searchEngine") || "google";
    const engines = {
        google: `https://google.com/search?q=${encodeURIComponent(input)}`,
        bing: `https://bing.com/search?q=${encodeURIComponent(input)}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(input)}`,
        yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(input)}`
    };
    return engines[engine] || engines.google;
}

function showLoadingScreen() {
    loadingScreen.style.display = "flex";
    loadingScreen.querySelector(".loading-text").textContent = "Loading up your content...";
}

function hideLoadingScreen() {
    loadingScreen.querySelector(".loading-text").textContent = "Finish!";
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 2000);
}

function preloadResources() {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://www.google.com'; 
    link.as = 'fetch';
    document.head.appendChild(link);
}

function getUrlWithDelay(url) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(__uv$config.prefix + __uv$config.encodeUrl(url));
        }, 1000);
    });
}

function updateSearchEngine(engine) {
    searchEngineSelect.value = engine;
}

preloadResources();

function updateTitleAndIcon() {
    try {
        const iframeDocument = frame.contentDocument || frame.contentWindow.document;

        if (iframeDocument) {
            const iframeTitle = iframeDocument.title;
            if (iframeTitle && document.title !== iframeTitle) {
                document.title = iframeTitle;  
            }

            const iframeIconLink = iframeDocument.querySelector("link[rel~='icon']") || iframeDocument.querySelector("link[rel~='shortcut icon']");
            if (iframeIconLink) {
                updateFavicon(iframeIconLink.href);
            }
        }
    } catch (error) {
        console.error("Error accessing iframe content:", error);
    }
}

function updateFavicon(iconUrl) {
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
    }
    if (favicon.href !== iconUrl) {
        favicon.href = iconUrl;
    }
}

setInterval(updateTitleAndIcon, 1000);
