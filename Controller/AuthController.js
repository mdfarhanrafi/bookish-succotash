import prisma from "../DB/db.config.js"
import vine,{errors} from "@vinejs/vine";
import { loginSchema, registerSchema } from "../Validation/authValidation.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import logger from "../config/logger.js";
import { sendEmail } from "../config/mailer.js";
import { Status } from "../config/status.js";

class AuthController {

    static async register(req, res){
       
          try {
              const body = req.body;
              const validator = vine.compile(registerSchema)
              const payload =await validator.validate(body)
                  
              const salt = bcrypt.genSaltSync(10);
              payload.password = bcrypt.hashSync(payload.password, salt);
              await prisma.user.create({
                  data:payload
              })
           

              return res.json({payload})
              
          } catch (error) {
              if (error instanceof errors.E_VALIDATION_ERROR) {
                //  console.log(error.messages)
                return res.status(400).json({errors:error.messages})
              }
              else {
                  
                  return res.json({status:500, message:"Please try again later"})
              }
          }
   

    }

    static async login(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(loginSchema)
            const payload = await validator.validate(body)
            
           const findUser = await prisma.user.findUnique({
                where:{
                   email: payload.email
                }
            }) 
            if (findUser) {
                if (!bcrypt.compareSync(payload.password, findUser.password)) {
                    return res.status(400).json({
                        errors: {
                            email: "Invalid creadentials"
                        }
                    })
                }
                const payloaddata = {
                    id: findUser.id,
                    name: findUser.name,
                    email: findUser.email,
                    profile:findUser.profile
                }
                const token = jwt.sign(payloaddata, process.env.JWT_SECRETE, {
                    expiresIn: "365d",
                }, { algorithm: 'RS256' },); 



                return res.json({ status: 200, message: "User logged in successfully", access_token: `Bearer ${token}`})
    
            } 
 
         } catch (error) {
             if (error instanceof errors.E_VALIDATION_ERROR) {
                 //  console.log(error.messages)
                 return res.status(400).json({ errors: error.messages })
             }else {

                 return res.json({ status: 500, message: "Please try again later" })
             }
            }
         }     
   
    static async sendEmail(req, res){
     try {
         const { email } = req.query
         const payload = {
             toemail: email,
             subject: "You are talent",
             body:"<h1>YOU ARE HACKED</h1>"
         }
        await sendEmail (payload.toemail,payload.subject,payload.body) 
         Status(res,200,"Email sent")
     } catch (error) {
        logger.error(error)
     }      
 

    }
}
  



export default AuthController