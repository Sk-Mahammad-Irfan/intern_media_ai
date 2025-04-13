import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import validator from "validator";

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please fill all field",
            });
        }

        if (username.length > 30 || email.length > 50 || password.length > 100) {
            return res.status(400).send({
                success: false,
                message: "Invalid username, email or password",
            });
        }

        if (!validator.isEmail(email) || !validator.isAlpha(username) || !validator.isStrongPassword(password)) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or username or password",
            });
        }

        const exisitingUser = await userModel.findOne({ email });

        if (exisitingUser) {
            return res.status(401).send({
                success: false,
                message: "user already exisits",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await new userModel({
            username,
            email,
            password: hashedPassword,
        }).save();

        res.status(200).send({
            success: true,
            message: "User Registered",
            user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in register",
            err,
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (validator.isEmpty(email) || validator.isEmpty(password)) {
            return res.status(400).send({
                success: false,
                message: "Please fill all field",
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).send({
            success: true,
            message: "Login successfully",
            user: {
                username: user.username,
                email: user.email,
            },
            token,
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in login",
            err,
        });
    }
}

export const successGoogleLogin = async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            message: "success login using google",
            user: req.user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in successGoogleLogin",
            error,
        });
    }
}

export const failureGoogleLogin = async (req, res) => {
    try {
        res.status(401).send({
            success: false,
            message: "failure login using google",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in failureGoogleLogin",
            error,
        });
    }
}

// test protected route
export const testProtectedRoute = async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            message: "test authenticated route",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in testAuthenticated",
            error,
        });
    }
}
