import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import { Vehicle } from "./entities/Vehicle";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

AppDataSource.initialize()
    .then(async () => {
        console.log("✅ Az adatbázis kapcsolat sikeresen létrejött!");

        const vehicleRepo = AppDataSource.getRepository(Vehicle);


        const vehicleCount = await vehicleRepo.count();
        if (vehicleCount === 0) {
            await vehicleRepo.save([
                {
                    brand: 'Tesla Model 3',
                    category: '4 kerekű',
                    licensePlate: 'ABC-123',
                    dailyRate: 25000,
                    kmRate: 100,
                    status: 'szabad'
                },
                {
                    brand: 'BMW X5',
                    category: '4 kerekű',
                    licensePlate: 'DEF-456',
                    dailyRate: 35000,
                    kmRate: 150,
                    status: 'szabad'
                },
                {
                    brand: 'Volkswagen Golf',
                    category: '4 kerekű',
                    licensePlate: 'GHI-789',
                    dailyRate: 18000,
                    kmRate: 80,
                    status: 'szabad'
                },
                {
                    brand: 'Audi A4',
                    category: '4 kerekű',
                    licensePlate: 'AUD-001',
                    dailyRate: 22000,
                    kmRate: 90,
                    status: 'szabad'
                },
                {
                    brand: 'Mercedes-Benz C-Class',
                    category: '4 kerekű',
                    licensePlate: 'MER-002',
                    dailyRate: 28000,
                    kmRate: 120,
                    status: 'szabad'
                },
                {
                    brand: 'Yamaha WaveRunner',
                    category: 'vízi',
                    licensePlate: 'YAM-W01',
                    dailyRate: 40000,
                    kmRate: 0,
                    status: 'szabad'
                }
            ]);
            console.log("✅ Járművek feltöltve az adatbázisba!");
        } else {
            console.log(`✅ Adatbázisban már van ${vehicleCount} jármű, nem töltjük újra.`);
        }

        app.listen(3000, () => {
            console.log("🚀 A szerver fut: http://localhost:3000");
        });
    })
    .catch((error) => console.log("❌ Hiba az adatbázis indításakor: ", error));