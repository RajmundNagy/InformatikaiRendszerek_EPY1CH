import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const JWT_SECRET = "titkos_kulcs_a_beadandohoz_2026";

export class AuthController {

    // REGISZTRÁCIÓ
    static async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const userRepo = AppDataSource.getRepository(User);

            // Ellenőrizzük, hogy létezik-e már ilyen email
            const existingUser = await userRepo.findOneBy({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Ez az email cím már foglalt!" });
            }

            // Jelszó titkosítása
            const hashedPassword = await bcrypt.hash(password, 10);

            // Felhasználó mentése
            const user = new User();
            user.email = email;
            user.password = hashedPassword;
            await userRepo.save(user);

            return res.status(201).json({ message: "Sikeres regisztráció!" });
        } catch (error) {
            return res.status(500).json({ message: "Szerverhiba a regisztráció során" });
        }
    }

    // BEJELENTKEZÉS
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const userRepo = AppDataSource.getRepository(User);

            const user = await userRepo.findOneBy({ email });
            if (!user) {
                return res.status(401).json({ message: "Hibás email vagy jelszó!" });
            }

            // Jelszó ellenőrzése
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Hibás email vagy jelszó!" });
            }

            // Token generálása (1 napig érvényes)
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

            return res.status(200).json({ message: "Sikeres bejelentkezés!", token });
        } catch (error) {
            return res.status(500).json({ message: "Szerverhiba a bejelentkezés során" });
        }
    }
}
