import { RouterContext, hashSync, compareSync } from "../deps.ts";
import User from "../models/User.ts";

class AuthController {
    async register(ctx: RouterContext){
        const { value: { name, email, password } } = await ctx.request.body();    
        
        // Check if email is already registered
        let user = await User.findOne({ email });
        if(user){
            ctx.response.status = 422;
            ctx.response.body = { message: "Email is already registered." };
            return;
        }
        //If user doesn't exist, continue to register user...
        
        //Generating Hashed Password
        const hashedPassword = hashSync(password);
        
        user = new User({ name, email, password: hashedPassword });
        await user.save();
        ctx.response.status = 201;
        ctx.response.body = {
            id: user.id,
            name: user.name,
            email: user.email
        };

    }
}

const authController = new AuthController();

export default authController;