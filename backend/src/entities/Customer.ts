import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Rental } from "./Rental";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    address!: string;

    @Column()
    idNumber!: string; // Igazolványszám

    @Column()
    phone!: string;

    @OneToMany(() => Rental, rental => rental.customer)
    rentals!: Rental[];
}