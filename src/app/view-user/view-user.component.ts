import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Service } from "../services/service.service";



@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  
  public form: FormGroup;
  userId = this.route.snapshot.params['id'];
  loginId = localStorage.getItem('loginId');
  userList: Array<any> = [];
  showError: boolean;
  errorMsg: string;
  firstName:string;
  lastName: string;
  emailId: string;
  contactNumber: number;
  relationName:string;
  depfirstName:string;
  deplastName: string;
  depemailId: string;
  depcontactNumber: number;
  password:string
  userStatus: any;
  loader =true;



  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private Service: Service,
    private fb: FormBuilder,

  ) { 
    this.getData();

  }

  ngOnInit() {
    this.form = this.fb.group({
      depfirstname: [null, Validators.compose([Validators.required])],
      deplastname: [null, Validators.compose([Validators.required])],
      depemailid: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      relationname: [null, Validators.compose([Validators.required])],   
      Contactnumber: [null, Validators.compose([Validators.required])],

    })
  }

  chooseRealtionShip(){
    console.log(this.relationName);    
  }
  getData() {
    this.loader = true; 

    this.Service.getMethod('users/get/'+ this.userId).subscribe(response => {
      console.log(response);
      if (response.error == false) {
        this.userList = response.data;
        this.firstName = this.userList[0].fname;
        this.lastName = this.userList[0].lname;
        this.emailId = this.userList[0].emailid;
        this.contactNumber = this.userList[0].contactno;
        this.userStatus = this.userList[0].ustatus;
        // this.showError = false;
        console.log(this.userList);
        this.loader = false; 
      } 
      else {
        this.loader = false; 
        this.showError = true;
        this.errorMsg = response.message;
      }
    });
  }

  addRelUser() {

    this.loader = true; 

    let data = {
      "fname": this.depfirstName,
      "lname": this.deplastName,
      "emailid": this.depemailId,
      "password": this.password,
      "contactno": this.depcontactNumber,
      "createdby": this.loginId,
      "parentid":this.userId,
    }

    this.Service.postMethod('users/create', JSON.stringify(data))
      .subscribe((response => {
        console.log(response);
        if (response.error == false) { 
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
