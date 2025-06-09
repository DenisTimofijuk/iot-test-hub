import { Router } from "express";
import { loginHandler } from "../controllers/auth";


const authRouter = Router();

authRouter.post("/login", loginHandler);

export default authRouter;
