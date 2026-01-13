// content.js - Fixed "Flickering" Issue

console.log("Raksha-AI: Extension Loaded! (Sticky Mode)");

// --- 1. UI Setup ---
const container = document.createElement("div");
container.style.position = "fixed";
container.style.bottom = "15px";
container.style.right = "15px";
container.style.zIndex = "9999";
container.style.display = "flex";
container.style.gap = "10px";
container.style.alignItems = "center";
container.style.fontFamily = "Arial, sans-serif";
document.body.appendChild(container);

const badge = document.createElement("div");
badge.innerText = "🛡️ Raksha Safe";
badge.style.backgroundColor = "#2ecc71";
badge.style.color = "white";
badge.style.padding = "8px 12px";
badge.style.borderRadius = "20px";
badge.style.fontSize = "14px";
badge.style.fontWeight = "bold";
badge.style.transition = "background-color 0.2s ease"; 
container.appendChild(badge);

const cleanBtn = document.createElement("button");
cleanBtn.innerText = "✨ Clean Data";
cleanBtn.style.backgroundColor = "#e74c3c";
cleanBtn.style.color = "white";
cleanBtn.style.border = "none";
cleanBtn.style.padding = "8px 15px";
cleanBtn.style.borderRadius = "20px";
cleanBtn.style.cursor = "pointer";
cleanBtn.style.fontWeight = "bold";
cleanBtn.style.display = "none"; 
container.appendChild(cleanBtn);

// --- 2. Configuration ---
const SAFE_DATA = {
    phone: "0000000000",
    email: "protected@user.com",
    pan: "XXXXX0000X"
};

const patterns = {
    indianPhone: /(?:\+91[\-\s]?)?[6-9]\d{9}/g,
    email: /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g,
    panCard: /[A-Z]{5}[0-9]{4}[A-Z]{1}/g
};

// --- 3. The Polling Loop ---
let isCleaning = false;

setInterval(() => {
    if (isCleaning) return;

    const textBox = document.querySelector('#prompt-textarea') || 
                    document.querySelector('[contenteditable="true"]');

    if (textBox) {
        scanText(textBox);
    }
}, 500); // Faster check (0.5s) for better responsiveness

// --- 4. Scanning Logic (THE FIX) ---
function scanText(element) {
    const text = element.innerText || ""; 
    let warningFound = false;

    // CRITICAL FIX: Reset the "lastIndex" of regexes before testing
    // This stops the Red/Green toggling
    patterns.indianPhone.lastIndex = 0;
    patterns.email.lastIndex = 0;
    patterns.panCard.lastIndex = 0;

    // Check 1: Phone
    if (patterns.indianPhone.test(text) && !text.includes(SAFE_DATA.phone)) {
        warningFound = true;
    }
    
    // Check 2: Email
    if (patterns.email.test(text) && !text.includes(SAFE_DATA.email)) {
        warningFound = true;
    }

    // Check 3: PAN
    if (patterns.panCard.test(text) && !text.includes(SAFE_DATA.pan)) {
        warningFound = true;
    }

    updateUI(element, warningFound);
}

// --- 5. UI Update ---
function updateUI(element, isRisk) {
    if (isRisk) {
        // Only update if it's not already Red (Prevents jitter)
        if (badge.innerText !== "⚠️ Privacy Risk!") {
            badge.innerText = "⚠️ Privacy Risk!";
            badge.style.backgroundColor = "#e74c3c"; 
            cleanBtn.style.display = "block";
            
            element.style.border = "2px solid red";
            element.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
        }
    } else {
        // Only update if it's not already Green
        if (badge.innerText !== "🛡️ Raksha Safe") {
            badge.innerText = "🛡️ Raksha Safe";
            badge.style.backgroundColor = "#2ecc71"; 
            cleanBtn.style.display = "none";
            
            element.style.border = "none";
            element.style.backgroundColor = "transparent";
        }
    }
}

// --- 6. Cleaning Logic ---
cleanBtn.addEventListener("click", () => {
    const textBox = document.querySelector('#prompt-textarea') || 
                    document.querySelector('[contenteditable="true"]');
    
    if (!textBox) return;

    isCleaning = true; // Lock scanning

    let text = textBox.innerText; 

    // We can safely use replace here because the regexes are global
    text = text.replace(patterns.indianPhone, SAFE_DATA.phone);
    text = text.replace(patterns.email, SAFE_DATA.email);
    text = text.replace(patterns.panCard, SAFE_DATA.pan);

    textBox.innerText = text;
    
    const event = new Event('input', { bubbles: true });
    textBox.dispatchEvent(event);

    // Wait a moment before unlocking, to let the UI settle
    setTimeout(() => {
        isCleaning = false;
        // Force an immediate re-scan to turn the badge Green instantly
        scanText(textBox); 
    }, 200);
});