import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js"
import JWT from "jsonwebtoken";

export  const registerController=async(req,resp)=>{
    try {
        
        const {name,email,password,phone,address}=req.body
        if(!name){
            return resp.send({error:"Name is Required"})
        }
        if(!email){
            return resp.send({error:"Email is Required"})
        }
        if(!password){
            return resp.send({error:"PAssword is Required"})
        }
        if(!phone){
            return resp.send({error:"Phone Number is Required"})
        }
        if(!address){
            return resp.send({error:"Address is Required"})
        }

        const exisitingUser=await userModel.findOne({email})

        if(exisitingUser){
            return req.status(200).send({
                success:true,
                message:'Already Register please login'
            })
        }
        const hashedPassword=await hashPassword(password)
        
        const user= await new userModel({name,email,phone,address,password:hashedPassword}).save();
        resp.status(201).send({
            success:true,
            message:'User Register Successfully',
            user
        })



    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success:false,
            message:"Error in Registeration",
            error
        })
    }
}

export const loginController=async(req,resp)=>{
    try {
        const {email,password}=req.body
        if(!email || !password){
            return resp.status(404).send({
                success:false,
                message:"Invail email or password"
            })
        }
        const user =await userModel.findOne({email})
        if(!user){
            return resp.status(404).send({
                success:false,
                message:"Email is not registerd"
            })
        }
        const match= await comparePassword(password,user.password)
        if(!match){
            return resp.status(200).send({
                success:false,
                message:"Invaild Passwoord"
            })
        }

        const token = await JWT.sign({ _id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        resp.status(200).send({
            success:true,
            message:"Login successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
            },
            token
        })

    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success:false,
            message:"Error in Login",
            error
        })
    }
}




export const testController=(req,resp)=>{
    try {
        resp.send("Protected route");
    } catch (error) {
        console.log(error);
        resp.send({error});
    }
}