import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Vehicle } from "./Vehicle";
import { Customer } from "./Customer";

@Entity()
export class Rental {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, customer => customer.rentals)
    customer: Customer;

    @ManyToOne(() => Vehicle, vehicle => vehicle.rentals)
    vehicle: Vehicle;

    @Column()
    rentalDate: Date;

    @Column({ nullable: true })
    returnDate: Date;

    @Column({ default: 0 })
    distanceTraveled: number;

    @Column({ default: false })
    isDamaged: boolean;

    @Column({ type: "float", default: 0 })
    totalPrice: number;
}