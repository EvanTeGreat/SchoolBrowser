const frame = document.querySelector("iframe");
const div = document.querySelector(".search-container");
const loadingScreen = document.querySelector(".loading-screen");
const navbar = document.querySelector(".navbar");

const searchInput1 = document.getElementById("searchInput");
const searchInput2 = document.getElementById("searchInputt");

navbar.style.display = "none";
frame.style.display = "none";
searchInput2.style.display = "block";

const searchInputs = [searchInput1, searchInput2];
searchInputs.forEach(input => {
    input.addEventListener("keyup", event => {
        if (event.key === "Enter") {
            handleSearch(input.value);
        }
    });
});

// Function to handle search
async function handleSearch(query) {
    showLoadingScreen();
    div.style.display = "none";
    frame.style.display = "block";

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
    return `https://google.com/search?q=${encodeURIComponent(input)}`;
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
    link.as = 'document';
    document.head.appendChild(link);
}

function getUrlWithDelay(url) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(__uv$config.prefix + __uv$config.encodeUrl(url));
        }, 1000);
    });
}

preloadResources();