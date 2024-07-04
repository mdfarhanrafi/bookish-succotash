
import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (header == null || header == undefined) {
        
        return res.status(401).json({status:401, message: "unauthorized"})
    }
    const token = header.split(" ")[1]
      
    jwt.verify(token, process.env.JWT_SECRETE, (err, user) => {
        if (err) return res.status(401).json({ status: 401, message: "unauthorized" })
        req.user = user;
        next() 
    })



}
export default authMiddleware