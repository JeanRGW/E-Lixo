import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET: string = process.env.SECRET || "Development";

/**
 * Express middleware to handle JWT verification.\
 * Secret is read from process.env.SECRET.
 *
 * Req must contain token on req.cookies, req.body or req.query
 */
const jwtCheck = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token: string = req.cookies?.token || req.body?.token || req.query?.token || null;
		req.decodedToken = jwt.verify(token, SECRET);
		next();
	} catch (err) {
		console.log(err);
		return res.clearCookie("token").redirect("/login");
	}
};

export default jwtCheck;
