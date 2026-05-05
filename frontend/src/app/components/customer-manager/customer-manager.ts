import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-manager.html'
})
export class CustomerManagerComponent implements OnInit {
  private http = inject(HttpClient);

  customers: any[] = [];
  newCustomer = {
    name: '',
    address: '',
    idNumber: '',
    phone: ''
  };

  ngOnInit() {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.http.get<any[]>('http://localhost:3000/api/customers').subscribe({
      next: (data) => this.customers = data,
      error: (err) => console.error('Hiba az ügyfelek lekérésekor', err)
    });
  }

  createCustomer() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Kérlek, jelentkezz be!");
        return;
    }

    this.http.post('http://localhost:3000/api/customers', this.newCustomer, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert('Ügyfél sikeresen rögzítve!');
        this.newCustomer = { name: '', address: '', idNumber: '', phone: '' };
        this.fetchCustomers();
      },
      error: (err) => alert('Hiba történt: ' + (err.error?.message || 'Sikertelen mentés.'))
    });
  }
}
