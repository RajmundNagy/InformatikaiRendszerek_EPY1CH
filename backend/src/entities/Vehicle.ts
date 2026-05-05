import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Rental } from "./Rental";

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    category: string; // "4 kerekű" vagy "vízi"

    @Column()
    brand: string;

    @Column({ unique: true })
    licensePlate: string; // Rendszám

    @Column({ nullable: true })
    chassisNumber: string; // Alvázszám

    @Column({ type: "date", nullable: true })
    purchaseDate: Date; // Beszerzés dátuma

    @Column({ nullable: true })
    inventoryNumber: string; // Sorszám / Készletszám

    @Column()
    dailyRate: number; // Napi díj (pl. 10000 Ft)

    @Column()
    kmRate: number; // Kilométer díj (pl. 100 Ft/km)

    @Column({ default: "szabad" })
    status: string; // szabad, kikölcsönzött, selejtezett

    @OneToMany(() => Rental, rental => rental.vehicle)
    rentals: Rental[];
}