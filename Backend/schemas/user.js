const {z} = require('zod');


const userSignUpSchema = z.object({
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
})

const userSigninSchema = z.object({
    username: z.string(),
    password: z.string()
})

module.exports = {userSigninSchema, userSignUpSchema}