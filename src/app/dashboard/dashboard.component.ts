import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  id: any = '';

  constructor(private router: Router) { }

  ngOnInit() {
    // Initialization logic can be added here if needed
  }

  // Logout function
  logout() {
    Swal.fire({
      text: "Are you sure you want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Admin logged out successfully.', 'success');
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  // Method to navigate to change password page
  changePassword() {
    this.router.navigate(['/dashboard/change-password']);
  }

}
