import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../services/service.service';
import Swal from 'sweetalert2';

// Interface for status options
export interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userId: string;
  userList: any[] = [];
  firstName: string;
  registrationDate: string;
  emailId: string;
  contactNumber: number;
  loader = true;
  
  constructor(
    private service: Service,
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.userId = this.route.snapshot.params['id'];
    this.getData();
  }

  ngOnInit() {}

  status: Status[] = [
    { value: '0', viewValue: 'Approve' },
    { value: '2', viewValue: 'Reject' },
  ];

  // Fetch user data
  getData() {
    this.loader = true; 
    this.service.getMethod('users/get/' + this.userId).subscribe(response => {
      console.log(response);
      if (response.error === false) {
        this.userList = response.data;
        this.firstName = this.userList[0].fname;
        this.registrationDate = this.userList[0].created_at;
        this.emailId = this.userList[0].emailid;
        this.contactNumber = this.userList[0].contactno;
        this.loader = false;
        console.log(this.userList);
      }
    });
  }

  // Edit user
  editUser() {
    this.loader = true; 
    let data = {
      "firstname": this.firstName,
      "contactnumber": this.contactNumber,
    };

    this.service.putMethod('users/update/' + this.userId, JSON.stringify(data))
      .subscribe((response) => {
        console.log(response);
        if (response.error === false) {
          Swal.fire(response.message, 'success');
          this.loader = false; 
          this.router.navigate(['/dashboard/users']);
        }
      },
      (error) => {
        this.loader = false; 
        console.log(error);
      });
  }
}
