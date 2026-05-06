import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss'
})
export class VehicleListComponent implements OnInit {
  private http = inject(HttpClient);
  router = inject(Router);

  vehicles: any[] = [];
  searchCategory: string = '';
  searchLicensePlate: string = '';

  ngOnInit() {
    this.fetchVehicles();
  }

  fetchVehicles() {
    let url = 'http://localhost:3000/api/vehicles?';
    if (this.searchCategory) url += `category=${this.searchCategory}&`;
    if (this.searchLicensePlate) url += `licensePlate=${this.searchLicensePlate}&`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error('Hiba az autók letöltésekor', err)
    });
  }

  rentVehicle(vehicleId: number) {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Kérlek, jelentkezz be a bérléshez!');
      this.router.navigate(['/login']);
      return;
    }

    const customerIdStr = prompt("Add meg az Ügyfél azonosítódat (ID) a bérléshez:\nHa még nincs, a Profilom / Ügyfelek menüben hozhatsz létre egyet.");
    if (!customerIdStr) return;
    
    const customerId = parseInt(customerIdStr);
    if (isNaN(customerId)) {
        alert('Érvénytelen azonosító!');
        return;
    }

    this.http.post('http://localhost:3000/api/rentals/start', { vehicleId, customerId }, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        alert('Sikeres bérlés! Jó utat!');
        this.fetchVehicles();
      },
      error: (err: any) => {
        alert('Hiba történt: ' + (err.error?.message || 'Nem sikerült a bérlés.'));
      }
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  showAddForm = false;
  newVehicle: any = {
    category: '4 kerekű',
    brand: '',
    licensePlate: '',
    dailyRate: null,
    kmRate: null,
    chassisNumber: '',
    purchaseDate: '',
    inventoryNumber: ''
  };

  addVehicle() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.post('http://localhost:3000/api/vehicles', this.newVehicle, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('Jármű sikeresen hozzáadva!');
        this.showAddForm = false;
        this.fetchVehicles();
        this.newVehicle = { category: '4 kerekű', brand: '', licensePlate: '', dailyRate: null, kmRate: null, chassisNumber: '', purchaseDate: '', inventoryNumber: '' };
      },
      error: (err) => alert('Hiba történt: ' + (err.error?.message || 'Nem sikerült hozzáadni.'))
    });
  }

  deleteVehicle(vehicleId: number) {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!confirm('Biztosan törölni szeretnéd ezt a járművet?')) return;

    this.http.delete(`http://localhost:3000/api/vehicles/${vehicleId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('Jármű sikeresen törölve!');
        this.fetchVehicles();
      },
      error: (err) => alert('Hiba történt a törlés során: ' + (err.error?.message || 'Nem sikerült a törlés.'))
    });
  }
}
