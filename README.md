# [CRITICAL] Remote Signing Bypass via Call Data Injection (CVSS 9.8)

**Target:** `@verified-network/verified-custody`
**Date:** January 6, 2026

## 🚨 Executive Summary
A critical logic flaw exists in the `verified-custody` SDK's `signTransaction` method. The SDK fails to sanitize or validate the `data` field when the user intends to perform a standard value transfer. 

This allows a malicious dApp to present a "Simple ETH Transfer" to the user interface, while simultaneously injecting a hidden bytecode payload in the background. The result is **Blind Signing**: the user approves a transaction thinking they are sending 0 ETH, but actually executes a smart contract function that drains their wallet.

## 🛠 Proof of Concept (PoC)

This repository contains a reproduction script (`poc.js`) utilizing the official SDK.

### Instructions
1. Install dependencies:
   ```bash
   npm install
```
node poc.js
