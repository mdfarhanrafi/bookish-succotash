import { generateUnique, imageValidator } from "../utils/helper.js";
import prisma from "../DB/db.config.js";
class ProfileController{
   
    static async getUser(req, res) {
        const user = req.user;
        return res.json({status:200, User:user})
    }
    
    static async storeUser(req, res) {

    }
    static async showUser(req, res) {

    }
    static async updateUser(req, res) {

       try {
           const { id } = req.params
           const authuser = req.user;

           if (!req.files || Object.keys(req.files).length == 0) {
               return res.status(400).json({ status: 400, message: "profile image required" })
           }
           const profile = req.files.profile
          
           const message = imageValidator(profile?.size, profile.mimetype)
           if (message != null) {
               return res.status(400).json({
                   status: 400,
                   errors: {
                       profile: message,
                   }

               })
           }
           const imageext = profile?.name.split(".")
           const imagename = generateUnique() + "." + imageext[1]
           const uploadpath = process.cwd() + "/public/images/" + imagename;

           profile.mv(uploadpath, (err) => {
               if (err) throw err
           })
           await prisma.user.update({
               data: {
                   profile: imagename
               },
               where: {
                   id: Number(id),
               }
           });

           return res.json({ status: 200, message: "profile update" });

       } catch (error) {
         return res.status(500).json({status:500,message:" internal server error"})
       }

        
 
    }
    static async destroyUser(req, res) {

    }


}


export default ProfileController