import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Service } from "../services/service.service";
import Swal from 'sweetalert2'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  public form: FormGroup;
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  contactNumber: number;
  loginId = localStorage.getItem('loginId');
  repassword:string;
  isCheked:boolean =false;
  message ="Password Did Not Match";
  errorMsg:string;
  gender: any;
  loader = false;

  show: boolean = false;
  repeatshow: boolean = false;

  constructor(
    private router: Router,
    private Service: Service,
    private fb: FormBuilder

  ) { }

  ngOnInit() {
    this.password = '';
    this.form = this.fb.group({
      fname: [null, Validators.compose([Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$') ])],
      lname: [null, Validators.compose([Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$') ])],
      emailid: [null, Validators.compose([Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      rpassword: [null, Validators.compose([Validators.required, Validators.minLength(6)])],   
      Contactnumber: [null, Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      gender: ['', Validators.required]

    });
  }

  passwords() {
    this.show = !this.show;
  }

  repeatpasswords() {
    this.repeatshow = !this.repeatshow;
  }
  passwordMatch(){
    
    if(this.password === this.repassword){
      this.isCheked = false;
    }
    else {
      this.isCheked = true;
      this.errorMsg = this.message;
    }
    
  }

  chooseGender(){
    console.log(this.gender);    
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  addUser() {
    this.loader = true; 
    let data = {
      "fname": this.firstName,
      "lname": this.lastName,
      "emailid": this.emailId,
      "password": this.password,
      "contactno": this.contactNumber,
      "createdby": "1",
      "parentid":"0",
      "relationship":"self",
      "gender":this.gender
    }

    this.Service.postMethod('users/create', JSON.stringify(data))
      .subscribe((response => {
        if (response.error == false) {
          var message = response.data.fname + ' ' + response.data.lname + ' has been added successfully';
          Swal.fire(
            message,
            'success'
          ) 
          this.loader = false; 
          this.router.navigate(['/dashboard/users']);
        }else{
          Swal.fire(
            response.message,
            'error'
          ) 
          this.loader = false;
        }
      }),
        (error) => {
          this.loader = false; 
          console.log(error);
        }
      )
  }

}
