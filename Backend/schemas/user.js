const {z} = require('zod');


const userSignUpSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string()
})

const userSigninSchema = z.object({
    username: z.string().email(),
    password: z.string()
})

const updateUserSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().min(6).optional()
})

module.exports = {userSigninSchema, userSignUpSchema, updateUserSchema}