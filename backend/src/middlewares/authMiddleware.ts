import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "titkos_kulcs_a_beadandohoz_2026";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Nincs jogosultságod! Kérlek, jelentkezz be." });
    }

    const token = authHeader.split(" ")[1];

    try {

        jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Érvénytelen vagy lejárt token!" });
    }
};