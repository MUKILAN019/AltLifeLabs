import jwt from 'jsonwebtoken';

const user = process.env.SUPER_USER;
const pass = process.env.SU_PASSWORD;

const adminAuthMiddleware = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(403).json({error: "Access denied. No token provided."})
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(decoded.role !== "admin"){
            return res.status(403).json({error:"Access denied. Admins only."});
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({error:"Invalid token"});
    }

}

export default adminAuthMiddleware;

