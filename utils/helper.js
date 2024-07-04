import { supportedimage } from "../config/filesystem.js"
import { v4 as uuidv4 } from 'uuid';
import fs from "fs"
export const imageValidator = (size, mime) => {
    if (bytestoMb(size) > 2) {
          return "image size must be less than 2 Mb"
    } else if (!supportedimage.includes(mime)) {
        return "image must be type  of png, webp,jpg,jpeg,svg"
    } 
    
    return null
}
export const bytestoMb = (bytes) => {
    return bytes/(1024*1024)
}


export const generateUnique= () => {
    return uuidv4();
} 


export const getImageUrl = (imagename) => {
    
    return `${process.env.SERVER_URL}/images/${imagename}`

}


export const removeImage = (imagename) => {
    const path = process.cwd() + "/public/images/" + imagename;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }


}

export const uploadImage = (image) => {
    const imageext = image?.name.split(".")
    const imagename = generateUnique() + "." + imageext[1]
    const uploadpath = process.cwd() + "/public/images/" + imagename;

    image.mv(uploadpath, (err) => {
        if (err) throw err
    })
    return imagename;
}