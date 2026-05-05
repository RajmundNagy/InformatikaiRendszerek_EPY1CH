import { Router } from "express";
import { RentalController } from "./controllers/RentalController";
import { AuthController } from "./controllers/AuthController";
import { verifyToken } from "./middlewares/authMiddleware";
import { VehicleController } from "./controllers/VehicleController";
import { CustomerController } from "./controllers/CustomerController";

const router = Router();


router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

router.get("/vehicles", VehicleController.getAll);
router.get("/customers", CustomerController.getAll);
router.get("/rentals", RentalController.getAll);


router.post("/vehicles", verifyToken, VehicleController.create);
router.post("/customers", verifyToken, CustomerController.create);

router.post("/rentals/start", verifyToken, RentalController.startRental);
router.post("/rentals/:id/return", verifyToken, RentalController.returnVehicle);

export default router;