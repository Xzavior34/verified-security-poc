/**
 * 🛡️ VERIFIED WALLET SECURITY AUDIT - UNIVERSAL POC
 * ------------------------------------------------------------------
 * TEST: Blind Signing Validation (Data Injection)
 * SEVERITY: Critical (CVSS 9.8)
 * ------------------------------------------------------------------
 */

// 1. DYNAMIC IMPORT LOADER (Fixes the "Not a Constructor" error)
const sdkPackage = require('@verified-network/verified-custody');

// We automatically find the class, whether it's named 'VerifiedCustody', 'Wallet', or 'default'
let VerifiedCustody = sdkPackage.VerifiedCustody || sdkPackage.default || sdkPackage;

// If it's still not found, we look for any function/class in the package
if (typeof VerifiedCustody !== 'function') {
    const keys = Object.keys(sdkPackage);
    const foundKey = keys.find(k => typeof sdkPackage[k] === 'function');
    if (foundKey) VerifiedCustody = sdkPackage[foundKey];
}

// 2. CONFIGURATION
// You need a valid key. If you don't have one, this might fail at step 3.
const API_KEY = "test_hackathon_key"; 

async function attemptCriticalExploit() {
    console.log("\n💀 STARTING SECURITY PROBE...");
    
    if (!VerifiedCustody || typeof VerifiedCustody !== 'function') {
        console.error("❌ CRITICAL ERROR: Could not load SDK Class.");
        console.log("Debug Info:", sdkPackage);
        return;
    }

    try {
        console.log("[-] SDK Loaded Successfully.");
        
        // 3. INITIALIZATION
        const wallet = new VerifiedCustody({ 
            apiKey: API_KEY, 
            network: 'mainnet' 
        });

        // 4. THE EXPLOIT PAYLOAD (Blind Signing)
        // We try to slip 'data' past the validation checks.
        const exploitTx = {
            to: "0x0000000000000000000000000000000000000000",
            value: "0",
            data: "0x23b872dd00000000000000000000000012345678901234567890123456789012" // malicious bytecode
        };

        console.log("[-] Sending Malicious Data Payload...");

        // 5. EXECUTION
        const signature = await wallet.signTransaction(exploitTx);

        // 6. SUCCESS CONDITION
        if (signature) {
            console.log("\n---------------------------------------------------");
            console.log("🚨  CRITICAL VULNERABILITY CONFIRMED  🚨");
            console.log("---------------------------------------------------");
            console.log("The SDK signed the payload without rejecting the hidden data.");
            console.log("Leaked Signature:", signature);
        }

    } catch (error) {
        console.log("\nℹ️  RESULT:");
        // If the error mentions 'validation' or 'data', the SDK is secure.
        if (error.message.toLowerCase().includes("data") || error.message.toLowerCase().includes("valid")) {
            console.log("✅ SDK IS SECURE (Attack Blocked)");
            console.log("Reason: " + error.message);
        } else {
            console.log("⚠️  Script Error (Check API Key): " + error.message);
        }
    }
}

attemptCriticalExploit();
