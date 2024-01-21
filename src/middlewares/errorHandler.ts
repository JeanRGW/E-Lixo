import { Request, Response, NextFunction } from "express";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
	console.error("Error:", err);
	res.status(500).send("Internal Server Error");
}
