const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const login = (req, res) =>{
    const {id, password} = req.body;
    try {
        //access Token 발급
            const accessToken = jwt.sign({id},process.env.ACCESS_SECRET, {
                expiresIn : '30m',
                issuer : 'adminHJ'
            })
        //refresh Token 발급
            const refreshToken = jwt.sign({id},process.env.REFRESH_SECRET, {
                expiresIn : '60days',
                issuer : 'adminHJ'
            })
        //Token 전송
        res.cookie("accessToken", accessToken, {
            secure : false,
            httpOnly : true,
        })
        res.cookie("refreshToken", refreshToken, {
            secure : false,
            httpOnly : true,
        })
        // res.status(200).json("login success");
        res.sendFile(__dirname+'/public/')
    } catch (err) {
        res.status(500).json(err);
    }
};

const accessToken = (req, res) =>{
    
}

const refreshToken = (req, res) =>{
    
}

const loginSuccess = (req, res) =>{
    
}

const logout = (req, res) =>{
    
}

module.exports = {
    login,
    accessToken,
    refreshToken,
    loginSuccess,
    logout,
}