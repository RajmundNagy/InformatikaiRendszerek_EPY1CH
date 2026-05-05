import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-rentals.html',
  styleUrl: './my-rentals.scss'
})
export class MyRentals implements OnInit {
  private http = inject(HttpClient);
  rentals: any[] = [];

  showReturnModal = false;
  selectedRental: any = null;
  returnFormData = {
    distanceTraveled: 0,
    isDamaged: false
  };

  ngOnInit() {
    this.fetchRentals();
  }
  fetchRentals() {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:3000/api/rentals', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (data) => this.rentals = data,
      error: (err) => console.error('Hiba a bérlések lekérésekor', err)
    });
  }

  openReturnModal(rental: any) {
    this.selectedRental = rental;
    this.returnFormData = { distanceTraveled: 0, isDamaged: false };
    this.showReturnModal = true;
  }

  closeReturnModal() {
    this.showReturnModal = false;
    this.selectedRental = null;
  }

  submitReturn() {
    if (!this.selectedRental) return;
    const token = localStorage.getItem('token');


    const payload = {
      distanceTraveled: this.returnFormData.distanceTraveled,
      isDamaged: this.returnFormData.isDamaged,
      vehicleId: this.selectedRental.vehicle?.id
    };

    this.http.post(`http://localhost:3000/api/rentals/${this.selectedRental.id}/return`, payload, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        alert(`Sikeres visszavétel!\nA fizetendő végösszeg: ${res.totalPrice} Ft.`);
        this.closeReturnModal();
        this.fetchRentals();
      },
      error: (err) => {
        alert('Hiba történt a visszavétel során: ' + (err.error?.message || 'Ismeretlen hiba'));
      }
    });
  }
}