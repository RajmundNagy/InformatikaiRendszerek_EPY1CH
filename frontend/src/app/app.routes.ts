import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list';
import { authGuard } from './guards/auth-guard';
import { MyRentals } from './components/my-rentals/my-rentals';
import { CustomerManagerComponent } from './components/customer-manager/customer-manager';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'vehicles', component: VehicleListComponent },
    { path: 'my-rentals', component: MyRentals, canActivate: [authGuard] },
    { path: 'customers', component: CustomerManagerComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/vehicles', pathMatch: 'full' }
];