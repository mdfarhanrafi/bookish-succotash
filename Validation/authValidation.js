import vine from '@vinejs/vine'
import { CustomErrorReporter } from './CustomerrorRepoter.js'

vine.errorReporter = () => new CustomErrorReporter()

export const registerSchema = vine.object({
    name: vine.string().minLength(2).maxLength(100),
    email: vine.string().email(),
    password:vine.string().minLength(6).maxLength(100).confirmed(),

}) 

export const loginSchema = vine.object({
  
    email: vine.string().email(),
    password: vine.string(),

})