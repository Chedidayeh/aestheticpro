import * as z from 'zod'

export const LoginSchema = z.object ({
    email: z.string().email({
        message: 'Email is not Valid !'
    }),
    password: z.string().min(1,{
        message: 'Password is required !'
    }),

});

export const RegisterSchema = z.object ({
    userName: z.string().min(1,{
        message: 'UserName is required !'
    }),
    email: z.string().email({
        message: 'Email is required !'
    }),
    password: z.string().min(8,{
        message: 'At least 8 characters required !'
    }),
});

