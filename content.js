console.log("Raksha-AI: Extension Loaded! (Restore Mode)");

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

// The Button (Now acts as a Toggle)
const actionBtn = document.createElement("button");
actionBtn.innerText = "✨ Clean Data";
actionBtn.style.backgroundColor = "#e74c3c"; // Start Red
actionBtn.style.color = "white";
actionBtn.style.border = "none";
actionBtn.style.padding = "8px 15px";
actionBtn.style.borderRadius = "20px";
actionBtn.style.cursor = "pointer";
actionBtn.style.fontWeight = "bold";
actionBtn.style.display = "none"; 
container.appendChild(actionBtn);

// --- 2. Memory & Config ---
let originalTextCache = ""; // THE VAULT: Stores the real data
let isCleanedState = false; // Tracks if we are currently "Cleaned" or "Dirty"
let isProcessing = false;   // Prevents bugs during the swap

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
setInterval(() => {
    if (isProcessing) return; // Don't scan while swapping text

    const textBox = document.querySelector('#prompt-textarea') || 
                    document.querySelector('[contenteditable="true"]');

    if (textBox) {
        scanText(textBox);
    }
}, 500);

// --- 4. Scanning Logic ---
function scanText(element) {
    const text = element.innerText || ""; 
    
    // If we are in "Cleaned State", we don't need to scan for risks
    // We just wait for the user to click Restore
    if (isCleanedState) {
        return; 
    }

    let warningFound = false;
    patterns.indianPhone.lastIndex = 0;
    patterns.email.lastIndex = 0;
    patterns.panCard.lastIndex = 0;

    if ((patterns.indianPhone.test(text) && !text.includes(SAFE_DATA.phone)) ||
        (patterns.email.test(text) && !text.includes(SAFE_DATA.email)) ||
        (patterns.panCard.test(text) && !text.includes(SAFE_DATA.pan))) {
        warningFound = true;
    }

    updateUI(element, warningFound);
}

// --- 5. UI Update ---
function updateUI(element, isRisk) {
    // Scenario 1: Risk Found (Show "Clean" Button)
    if (isRisk && !isCleanedState) {
        if (badge.innerText !== "⚠️ Privacy Risk!") {
            badge.innerText = "⚠️ Privacy Risk!";
            badge.style.backgroundColor = "#e74c3c"; // Red
            
            actionBtn.innerText = "✨ Clean Data";
            actionBtn.style.backgroundColor = "#e74c3c"; // Red Button
            actionBtn.style.display = "block";
            
            element.style.border = "2px solid red";
            element.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
        }
    } 
    // Scenario 2: Safe (Hide Button)
    else if (!isRisk && !isCleanedState) {
        if (badge.innerText !== "🛡️ Raksha Safe") {
            badge.innerText = "🛡️ Raksha Safe";
            badge.style.backgroundColor = "#2ecc71"; // Green
            
            actionBtn.style.display = "none";
            
            element.style.border = "none";
            element.style.backgroundColor = "transparent";
        }
    }
}

// --- 6. The Toggle Logic (Clean <-> Restore) ---
actionBtn.addEventListener("click", () => {
    const textBox = document.querySelector('#prompt-textarea') || 
                    document.querySelector('[contenteditable="true"]');
    
    if (!textBox) return;

    isProcessing = true; // Pause scanning

    if (!isCleanedState) {
        // --- OPERATION: CLEAN ---
        console.log("Cleaning data...");
        
        // 1. Save Original to Vault
        originalTextCache = textBox.innerText; 
        
        // 2. Replace with Fakes
        let text = textBox.innerText;
        text = text.replace(patterns.indianPhone, SAFE_DATA.phone);
        text = text.replace(patterns.email, SAFE_DATA.email);
        text = text.replace(patterns.panCard, SAFE_DATA.pan);
        
        // 3. Update DOM
        textBox.innerText = text;
        
        // 4. Update State & Button
        isCleanedState = true;
        
        badge.innerText = "🔒 Secure Mode";
        badge.style.backgroundColor = "#3498db"; // Blue
        
        actionBtn.innerText = "↩️ Restore Original";
        actionBtn.style.backgroundColor = "#3498db"; // Blue Button
        
        // Remove Red Warnings
        textBox.style.border = "2px solid #3498db"; // Blue Border
        textBox.style.backgroundColor = "rgba(52, 152, 219, 0.05)";

    } else {
        // --- OPERATION: RESTORE ---
        console.log("Restoring data...");
        
        // 1. Retrieve from Vault
        if (originalTextCache) {
            textBox.innerText = originalTextCache;
        }
        
        // 2. Reset State
        isCleanedState = false;
        originalTextCache = ""; // Clear memory
        
        // 3. UI will automatically update on next scan (Red Badge will come back)
    }

    // Trigger Input Event (So React knows text changed)
    const event = new Event('input', { bubbles: true });
    textBox.dispatchEvent(event);

    // Resume scanning after small delay
    setTimeout(() => {
        isProcessing = false;
        // If we just restored, force a scan immediately to show the Red Warning again
        if (!isCleanedState) scanText(textBox);
    }, 200);
});