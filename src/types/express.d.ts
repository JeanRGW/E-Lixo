import { JwtPayload } from "jsonwebtoken";

// Estender Request para o middleware jwtCheck.ts
declare module "express-serve-static-core" {
	interface Request {
		decodedToken?: JwtPayload | string;
	}
}
