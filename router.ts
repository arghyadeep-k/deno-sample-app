import { Router, RouterContext } from "./deps.ts";
import { authController } from "./controllers/AuthController.ts";

const router = new Router();

router
    .get("/", (ctx: RouterContext) => {
        console.log("GET Request made on /");
        ctx.response.body = "Hello World!";
    })
    .post("/api/register", authController.register)


export default router;