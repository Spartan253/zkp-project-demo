const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

const verificationKeyPath = path.join(__dirname, "../verification_key.json");

// Load verification key synchronously at startup
let verificationKey;
try {
    verificationKey = JSON.parse(fs.readFileSync(verificationKeyPath, "utf-8"));
    console.log("✅ Verification key loaded successfully.");
} catch (error) {
    console.error("❌ Error loading verification key:", error.message);
    process.exit(1); // Stop execution if the key is missing
}

// Function to verify the ZK-SNARK proof
exports.verifyProof = async (proof, publicSignals) => {
    try {
        if (!verificationKey) {
            console.error("❌ Verification key is not loaded.");
            return false;
        }

        console.log("🔍 Verifying proof...");
        console.log("📜 Proof:", JSON.stringify(proof, null, 2));
        console.log("📊 Public Signals:", JSON.stringify(publicSignals, null, 2));

        // Validate proof structure
        if (!proof || typeof proof !== "object" || !proof.pi_a || !proof.pi_b || !proof.pi_c) {
            console.error("❌ Invalid proof structure:", proof);
            return false;
        }

        // Validate public signals
        if (!Array.isArray(publicSignals) || publicSignals.length === 0) {
            console.error("❌ Invalid public signals:", publicSignals);
            return false;
        }

        const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
        console.log("✅ Proof verification result:", isValid);
        return isValid;
    } catch (error) {
        console.error("❌ Error verifying proof:", error.message);
        return false;
    }
};

// Function to load a proving key (for generating proofs)
exports.loadProvingKey = (filePath) => {
    try {
        const provingKey = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        console.log("✅ Proving key loaded successfully.");
        return provingKey;
    } catch (error) {
        console.error("❌ Error loading proving key:", error.message);
        return null;
    }
};

// Function to generate a ZK-SNARK proof
exports.generateProof = async (witness, provingKeyPath) => {
    try {
        const provingKey = exports.loadProvingKey(provingKeyPath);
        if (!provingKey) {
            console.error("❌ Proving key not loaded.");
            return null;
        }

        console.log("🔍 Generating proof...");
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(witness, provingKey);

        console.log("✅ Proof generated successfully.");
        return { proof, publicSignals };
    } catch (error) {
        console.error("❌ Error generating proof:", error.message);
        return null;
    }
};

