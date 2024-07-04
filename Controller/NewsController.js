import prisma from "../DB/db.config.js";
import { newsSchema } from "../Validation/newsValidation.js";
import vine from "@vinejs/vine";
import { imageValidator, generateUnique, removeImage, uploadImage } from "../utils/helper.js";
import NewAPiTansform from "../transform/newsapitransform.js";
import { Status } from "../config/status.js";
import logger from "../config/logger.js";

class NewsController{
   static async index(req, res) {
       const page = Number(req.query.page) || 1;
       const limit = Number(req.query.limit) || 1;
       if (page <= 0) {
           page = 1;
       } 
       if (limit <= 0 || limit > 100) {
           limit=10
       }
       const skip = (page - 1) * limit;
    



        
        
       const news = await prisma.news.findMany({
            take: limit,
            skip : skip,
           
           
           include: {
               user: {
                   select: {
                       id: true,
                       name: true,
                       profile:true,
                   },
               },
           },
       })
       const newsTransform = news?.map((item) => NewAPiTansform.transform(item))
       const totalNews = await prisma.news.count()
       const totalPages= Math.ceil(totalNews/limit)

       return res.status(200).json({
           status: 200, news: newsTransform, metadata: {
               totalPages,
               currentPage: page,
               currentlimit: limit,
               
       }});
        
       
    } 
    static async store(req, res) {
        try {
            const authuser = req.user;
            const body = req.body;
            const validator = vine.compile(newsSchema)
            const payload = await validator.validate(body)
            if (!req.files || Object.keys(req.files).length == 0) {
                return res.status(400).json({ status: 400, message: "image required" })
            }
            const image = req.files?.image

            const message = imageValidator(image?.size, image.mimetype)     
            if (message != null) {
                return res.status(400).json({
                    status: 400,
                    errors: {
                        image: message,
                    }

                })
            }
           
            const imagename=  uploadImage(image)
            payload.image = imagename
            payload.user_id = authuser.id
            const news = await prisma.news.create({
                data: payload
            })
          //  res.json({ status: 200, news, message: "news created succefully" })
            Status(res, 200, 'news created successfully'); 
        } catch (error) {
            return res.status(500).json({ status: 500, message: " internal server error" })
        }
       
  


    }
    static async show(req, res) {
        try {
            const { id } = req.params
            const News = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }

                    }
                }
            })
            const news = News ? NewAPiTansform.transform(News) : null;

            Status(res, 200, "news factched", news)
        } catch (error) {
            Status(res,500)
            
        }
        
       
        
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const authuser = req.user;
            const body = req.body;
            
            const News = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                }
            })
            if (authuser.id != News.user_id) {
                Status(res, 400, "unauthorized")
            }
            const validator = vine.compile(newsSchema)
            const payload = await validator.validate(body)
            const image = req?.files?.image;
            if (image) {
                const message = imageValidator(image?.size, image?.mimetype)
                if (message != null) {
                    return res.status(400).json({
                        error: {
                            image: message,
                        }
                    })
                }
                    const imagename = uploadImage(image)
                    payload.image=imagename

                    removeImage(News.image)
                


            }

            await prisma.news.update({
                data: payload,
                where: {
                    id: Number(id)
                },
            });
            
            Status( res,200,"updated sucessfully",payload) 

        } catch (error) {
            logger.error(error)
            return res.status(500).json({ status: 500, message: " internal server error" })
        }

    }
    static async destroy(req, res) {
       try {
           const { id } = req.params
           const authuser = req.user
           const News = await prisma.news.findUnique({
               where: {
                   id: Number(id)
               }
           })
           if (authuser.id != News.user_id) {
               Status(res, 401, 'ünauthorized');
           }
           removeImage(News.image)

           await prisma.news.delete({
               where: {
                   id: Number(id)
               }
           })

           Status(res,200,"Deleted successfully")


       } catch (error) {
           return res.status(500).json({ status: 500, message: " internal server error" })

       }
      

    }


}



export default NewsController;