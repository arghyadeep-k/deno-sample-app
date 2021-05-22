import {
  compareSync,
  create,
  getNumericDate,
  hashSync,
  RouterContext,
  verify,
} from "../deps.ts";
import type { Header, Payload } from "../deps.ts";
import User from "../models/User.ts";

// Authentication Constants
const key = Deno.env.get("JWT_SECRET_KEY");
const header: Header = {
  alg: "HS256",
  typ: "JWT",
};

class AuthController {
  /**
   * Function to login
   */
  async login(ctx: RouterContext) {
    // Obtaining details from request body
    const { value: { email, password } } = await ctx.request.body();

    // Check if email or password was blank
    if (!email || !password) {
      ctx.response.status = 422;
      ctx.response.body = {
        message: "Please provide the email and password correctly.",
      };
      return;
    }
    // Check if email is not registered
    const user = await User.findOne({ email });
    if (!user) {
      ctx.response.status = 422;
      ctx.response.body = { message: "User does not exist with that email." };
      return;
    }

    // Check if password is correct
    if (!compareSync(password, user.password)) {
      ctx.response.status = 422;
      ctx.response.body = { message: "Incorrect password." };
      return;
    }

    // Assigning session jwt token
    const payload: Payload = {
      iss: user.email,
      exp: getNumericDate(60 * 60), // token expiration in one hour
    };
    const jwt = await create(header, payload, key);

    ctx.response.body = {
      id: user.id,
      name: user.name,
      email: user.email,
      jwt,
    };
  }

  /**
   * Function to register new users
   */
  async register(ctx: RouterContext) {
    // Obtaining details from request body
    const { value: { name, email, password } } = await ctx.request.body();

    // Check if name, email or password was blank
    if (!name || !email || !password) {
      ctx.response.status = 422;
      ctx.response.body = {
        message: "Please provide the name, email and password correctly.",
      };
      return;
    }

    // Check if email is already registered
    let user = await User.findOne({ email });
    if (user) {
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
      email: user.email,
    };
  }
}

const authController = new AuthController();

export default authController;
