import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Vehicle } from "../entities/Vehicle";

export class VehicleController {
    static async getAll(req: Request, res: Response) {
        try {
            const { category, licensePlate } = req.query;
            const vehicleRepo = AppDataSource.getRepository(Vehicle);

            let query = vehicleRepo.createQueryBuilder("vehicle");

            if (category) {
                query = query.andWhere("vehicle.category = :category", { category });
            }
            if (licensePlate) {
                query = query.andWhere("vehicle.licensePlate LIKE :licensePlate", { licensePlate: `%${licensePlate}%` });
            }

            const vehicles = await query.getMany();
            res.json(vehicles);
        } catch (error) {
            res.status(500).json({ message: "Hiba a járművek lekérésekor", error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { category, brand, licensePlate, dailyRate, kmRate, chassisNumber, purchaseDate, inventoryNumber } = req.body;
            const vehicleRepo = AppDataSource.getRepository(Vehicle);

            const vehicle = new Vehicle();
            vehicle.category = category;
            vehicle.brand = brand;
            vehicle.licensePlate = licensePlate;
            vehicle.dailyRate = dailyRate;
            vehicle.kmRate = kmRate;
            if (chassisNumber) vehicle.chassisNumber = chassisNumber;
            if (purchaseDate) vehicle.purchaseDate = new Date(purchaseDate);
            if (inventoryNumber) vehicle.inventoryNumber = inventoryNumber;

            await vehicleRepo.save(vehicle);
            res.status(201).json(vehicle);
        } catch (error) {
            res.status(500).json({ message: "Hiba a jármű létrehozásakor", error });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const vehicleRepo = AppDataSource.getRepository(Vehicle);

            const vehicle = await vehicleRepo.findOneBy({ id });
            if (!vehicle) {
                res.status(404).json({ message: "Jármű nem található" });
                return;
            }

            await vehicleRepo.remove(vehicle);
            res.json({ message: "Jármű sikeresen törölve" });
        } catch (error: any) {
            if (error?.code === 'SQLITE_CONSTRAINT') {
                res.status(400).json({ message: "Nem törölhető, mert már vannak hozzá rögzítve bérlések!" });
            } else {
                res.status(500).json({ message: "Hiba a jármű törlésekor", error });
            }
        }
    }
}
