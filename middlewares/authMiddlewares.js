import  JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';
export const requireSignIn= async (req,resp,next)=>{
try {
    const decode=JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
    req.user=decode;
    next();
    
} catch (error) {
    console.log(error)
}    
}

export const isAdmin= async(req,resp,next)=>{
    try {
        const user=await userModel.findById(req.user._id);
        if(user.role !== 1){
            return resp.status(401).send({
                success:false,
                message:"UnAuthorized Access"
            })
        }
        else{
            next();
        }
        
    } catch (error) {
        resp.status(401).send({
            success:false,
            error,
            message:"Error in admin middlewares"
        })
        
    }
}