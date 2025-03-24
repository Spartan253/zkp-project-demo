const snarkjs = require("snarkjs");
const { verifyProof } = require("../utils/zkpUtils");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
const { verifyZKP } = require("../utils/zkpUtils");

require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        const { email, username, password  } = req.body;

        // Check if user already exists
        const userPresent = await User.findOne({ email });
        if (userPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Validate inputs
        if (!username || !email || !password ) {
            return res.status(400).json({
                success: false,
                message: "Fill all the details",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password , 10);
  console.log(hashedPassword);
          //gwnerate public key
        const publicKey = crypto.randomBytes(32).toString("hex");

        // Create user
        const user = await User.create({
            username,
            password : hashedPassword, // Fixed variable name
            email,
            publickey:publicKey,
        });
        console.log("user",user);

        return res.status(200).json({
            success: true,
            message: "User signup successful",
            user,
        });
    }catch (error) {
        console.error("Signup error:", error);  // Log the error to see details
        return res.status(500).json({
            success: false,
            message: "User signup failed",
            error: error.message,  // Include the error message in the response (optional for debugging)
        });
    } 
};

exports.login = async (req, res) => {
    try {

        console.log(req.body);
        const {  proof, publicSignals } = req.body;

        
        if (  !proof || !publicSignals) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }
        // Check if user exists

        const publicKey  = BigInt("0x" + publicSignals[0]); 
        const user = await User.findOne({   publicKey: publicKey });
        console.log("Computed Public Key:", publicKey.toString());


        console.log("User found:", user);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Verify Zero-Knowledge Proof (ZKP)
        const isValid = await verifyProof(proof, publicSignals);
        console.log("ZKP Verification:", isValid);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid user",
            });
        }

        // Generate JWT token
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });

        // Set cookie options
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days expiry
            httpOnly: true,
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Logged in successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};
