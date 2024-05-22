import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userService } from "../services/service.service";

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  
  public form: FormGroup;
  userId: string;
  loginId: string;
  userList: any;
  showError: boolean;
  errorMsg: string;
  firstName: string;
  lastName: string;
  emailId: string;
  contactNumber: number;
  relationName: string;
  depFirstName: string;
  depLastName: string;
  depEmailId: string;
  depContactNumber: number;
  password: string;
  userStatus: any;
  loader: boolean = true;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private service: userService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.loginId = localStorage.getItem('loginId');
    this.form = this.fb.group({
      depFirstName: [null, Validators.required],
      depLastName: [null, Validators.required],
      depEmailId: [null, Validators.required],
      password: [null, Validators.required],
      relationName: [null, Validators.required],   
      depContactNumber: [null, Validators.required]
    });
    this.getData();
  }

  chooseRelationShip() {
    console.log(this.relationName);    
  }

  getData() {
    this.loader = true; 
    this.service.getMethod(`users/get/${this.userId}`).subscribe(response => {
      console.log(response);
      if (response.error == false) {
        this.userList = response.data;
        const user = this.userList[0];
        this.firstName = user.fname;
        this.lastName = user.lname;
        this.emailId = user.emailid;
        this.contactNumber = user.contactno;
        this.userStatus = user.ustatus;
        this.loader = false; 
      } else {
        this.showError = true;
        this.errorMsg = response.message;
        this.loader = false; 
      }
    });
  }

  addRelUser() {
    this.loader = true; 
    const data = {
      "fname": this.depFirstName,
      "lname": this.depLastName,
      "emailid": this.depEmailId,
      "password": this.password,
      "contactno": this.depContactNumber,
      "createdby": this.loginId,
      "parentid": this.userId,
    };
    this.service.postMethod('users/create', JSON.stringify(data))
      .subscribe((response) => {
        if (response.error == false) { 
          this.loader = false; 
          this.router.navigate(['/dashboard/users']);
        }
      }, (error) => {
        this.loader = false; 
        console.log(error);
      });
  }
}
