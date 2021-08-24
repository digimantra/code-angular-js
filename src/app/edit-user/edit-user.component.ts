import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";

import { Service } from "../services/service.service";
import Swal from 'sweetalert2'
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

  userId = this.route.snapshot.params['id'];
  userList: Array<any> = [];
  firstName: string;
   // lastName: string;
   registrationdate:string;
  emailId: string;
  contactNumber: number;
  // statusType: any;
  loader = true;
  sdate:Date;


  constructor(
    private Service: Service,
    public route: ActivatedRoute,
    private router: Router,


  ) {
    this.getData();

  }

  ngOnInit() {
  }

  status: Status[] = [
    { value: '0', viewValue: 'Approve' },
    { value: '2', viewValue: 'Reject' },
  ];
  //get data
  getData() {
    this.loader = true; 
    this.Service.getMethod('users/get/'+ this.userId).subscribe(response => {
      console.log(response);
      if (response.error == false) {
        this.userList = response.data;
        this.firstName = this.userList[0].fname;
         // this.lastName = this.userList[0].lname;
         this.registrationdate = this.userList[0].created_at;
        this.emailId = this.userList[0].emailid;
        this.contactNumber = this.userList[0].contactno;
        this.loader = false;
        console.log(this.userList);
      }
    });
  }
  //edit user
  edituser() {
    this.loader = true; 

    let data = {
      "firstname": this.firstName,
       // "lastname": this.lastName,
      "contactnumer": this.contactNumber,
    }
    this.Service.putMethod('users/update/' + this.userId, JSON.stringify(data))
      .subscribe((response => {
        console.log(response);
        if (response.error == false) {
          Swal.fire(
            response.message,
            'success'
          )
          this.loader = false; 
          this.router.navigate(['/dashboard/users']);
        }
      }),
        (error) => {
          this.loader = false; 
          console.log(error);
        }
      )
  }


}
