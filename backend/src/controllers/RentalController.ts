import { Request, Response } from "express";
import { AppDataSource } from "../data-source"; // Ezt a fájlt a következő lépésben hozzuk létre
import { Rental } from "../entities/Rental";
import { Vehicle } from "../entities/Vehicle";
import { Customer } from "../entities/Customer";

export class RentalController {

    // 1. Kölcsönzés indítása
    static async startRental(req: Request, res: Response) {
        try {
            const { vehicleId, customerId } = req.body;

            const vehicleRepo = AppDataSource.getRepository(Vehicle);
            const customerRepo = AppDataSource.getRepository(Customer);
            const rentalRepo = AppDataSource.getRepository(Rental);

            const vehicle = await vehicleRepo.findOneBy({ id: vehicleId });
            const customer = await customerRepo.findOneBy({ id: customerId });

            if (!vehicle || vehicle.status !== "szabad") {
                return res.status(400).json({ message: "Jármű nem található vagy nem szabad!" });
            }
            if (!customer) {
                return res.status(404).json({ message: "Ügyfél nem található!" });
            }

            // Új kölcsönzés létrehozása
            const rental = new Rental();
            rental.rentalDate = new Date();
            rental.customer = customer; // A kapcsolat bekötése
            rental.vehicle = vehicle;   // A kapcsolat bekötése

            // Jármű státuszának frissítése
            vehicle.status = "kikölcsönzött";
            await vehicleRepo.save(vehicle);

            await rentalRepo.save(rental);

            return res.status(201).json(rental);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Hiba a bérlés indításakor", error });
        }
    }

    // 2. Kölcsönzés befejezése és díjkalkuláció
    static async returnVehicle(req: Request, res: Response) {
        try {
            const rentalId = parseInt(req.params.id as string);
            const { distanceTraveled, isDamaged, vehicleId } = req.body;

            const rentalRepo = AppDataSource.getRepository(Rental);
            const vehicleRepo = AppDataSource.getRepository(Vehicle);

            const rental = await rentalRepo.findOneBy({ id: rentalId });
            const vehicle = await vehicleRepo.findOneBy({ id: vehicleId });

            if (!rental || !vehicle) {
                return res.status(404).json({ message: "Kölcsönzés vagy jármű nem található!" });
            }

            // --- DÍJKALKULÁCIÓ ---
            rental.returnDate = new Date();

            // 1. Napok számolása (Két dátum különbsége napokban)
            const diffTime = Math.abs(rental.returnDate.getTime() - rental.rentalDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const billedDays = diffDays === 0 ? 1 : diffDays; // Minimum 1 napot kiszámlázunk

            // 2. Alapdíj (Napok * Napi díj)
            let finalPrice = billedDays * vehicle.dailyRate;

            // 3. Kilométer díj hozzáadása
            finalPrice += (distanceTraveled * vehicle.kmRate);

            // 4. Sérülési pótdíj (a feladat szerint fix összeg, mondjuk 50.000 Ft)
            if (isDamaged) {
                finalPrice += 50000;
            }

            // Adatok mentése a bérléshez
            rental.distanceTraveled = distanceTraveled;
            rental.isDamaged = isDamaged;
            rental.totalPrice = finalPrice;
            await rentalRepo.save(rental);

            // Jármű státuszának visszaállítása
            vehicle.status = "szabad";
            await vehicleRepo.save(vehicle);

            return res.status(200).json({
                message: "Visszahozva, végösszeg kiszámolva",
                totalPrice: finalPrice,
                rentalDetails: rental
            });

        } catch (error) {
            return res.status(500).json({ message: "Hiba a visszavételkor" });
        }
    }

    // 3. Kölcsönzések listázása
    static async getAll(req: Request, res: Response) {
        try {
            const rentalRepo = AppDataSource.getRepository(Rental);
            const rentals = await rentalRepo.find({
                relations: ["customer", "vehicle"]
            });
            return res.json(rentals);
        } catch (error) {
            return res.status(500).json({ message: "Hiba a kölcsönzések lekérésekor" });
        }
    }
}