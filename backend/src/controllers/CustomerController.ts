import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Customer } from "../entities/Customer";

export class CustomerController {
    static async create(req: Request, res: Response) {
        try {
            const { name, address, idNumber, phone } = req.body;

            const customerRepo = AppDataSource.getRepository(Customer);

            const newCustomer = new Customer();
            newCustomer.name = name;
            newCustomer.address = address;
            newCustomer.idNumber = idNumber;
            newCustomer.phone = phone;

            await customerRepo.save(newCustomer);

            res.status(201).json(newCustomer);
        } catch (error) {
            res.status(500).json({ message: "Hiba az ügyfél létrehozásakor", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const customerRepo = AppDataSource.getRepository(Customer);
            const customers = await customerRepo.find();
            res.json(customers);
        } catch (error) {
            res.status(500).json({ message: "Hiba az ügyfelek lekérésekor", error });
        }
    }
}
