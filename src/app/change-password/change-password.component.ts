import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Service } from "../services/service.service";
import Swal from 'sweetalert2'


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  
  public form: FormGroup;
  oldPassword: string;
  password: string;
  repassword:string;
  loginId = localStorage.getItem('loginId');
  isCheked:boolean =false;
  message ="Password Did Not Match";
  errorMsg:string;
  loader = false;
  show: boolean = false;
  repeatshow: boolean = false;

  constructor(
    private router: Router,
    private Service: Service,
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.password = '';
    this.form = this.fb.group({
      opassword: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      rpassword: [null, Validators.compose([Validators.required])], 

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

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
  //change password
  changePassword() {
    this.loader = true; 
    let data = {
      "oldpassword": this.oldPassword,
      "newpassword": this.password,
      "userid": this.loginId,
    }

    this.Service.postMethod('users/change/password', JSON.stringify(data))
      .subscribe((response => {
        if (response.error == false) {
          var message = response.data.fname + ' ' + response.data.lname + ' has been added successfully';
          Swal.fire(
            response.message,
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
