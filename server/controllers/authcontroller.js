const bcrypt = require("bcrypt");
const usermodel = require("../models/user");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { email, password, firstName, lastName, role ,} = req.body;
        const user = await usermodel.findOne({ email });

        if (user) {   
            return res.status(409).json({ message: "User already exists, you can login", success: false });
        }

        const newuser = new usermodel({ email, password, firstName, lastName ,role});
        newuser.password = await bcrypt.hash(password, 10);
        await newuser.save();

        res.status(201).json({ message: "User created successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const login = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { email, password } = req.body;
        const user = await usermodel.findOne({ email });
        const errormsg = "Auth Failed: Wrong email or Password";

        if (!user) {   
            return res.status(403).json({ message: errormsg, success: false });
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return res.status(403).json({ message: errormsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },  // ✅ Include role in JWT
            process.env.JWT_SECRET, 
            { expiresIn: "5h" }
        );

        // ✅ Return role in response
        const storedUser = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            password: user.password
        };

        res.status(201).json({
            message: "Login success",
            success: true,
            jwtToken,
            user: storedUser// ✅ Added role here
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
module.exports = {
    signup,
    login
};
