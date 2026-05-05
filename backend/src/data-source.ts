import "reflect-metadata";
import { DataSource } from "typeorm";
import { Vehicle } from "./entities/Vehicle";
import { Rental } from "./entities/Rental";
import { Customer } from "./entities/Customer";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,           
    logging: false,
    entities: [Vehicle, Rental, Customer, User],
    migrations: [],
    subscribers: [],
});