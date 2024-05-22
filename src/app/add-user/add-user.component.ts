import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from "../services/service.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  public form: FormGroup;
  loginId = localStorage.getItem('loginId');
  showPassword: boolean = false;
  showRepeatPassword: boolean = false;
  isPasswordMismatch: boolean = false;
  loader: boolean = false;
  errorMsg: string;
  message = "Password Did Not Match";

  constructor(
    private router: Router,
    private service: Service,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: [null, [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
      emailId: [null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      repeatPassword: [null, [Validators.required, Validators.minLength(6)]],
      contactNumber: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      gender: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleRepeatPasswordVisibility() {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  checkPasswordMatch() {
    const password = this.form.get('password').value;
    const repeatPassword = this.form.get('repeatPassword').value;
    this.isPasswordMismatch = password !== repeatPassword;
    this.errorMsg = this.isPasswordMismatch ? this.message : '';
  }



//create new user 
  addUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.loader = true;
    
    const formData = this.form.value;
    const data = {
      fname: formData.firstName,
      lname: formData.lastName,
      emailid: formData.emailId,
      password: formData.password,
      contactno: formData.contactNumber,
      createdby: this.loginId,
      parentid: "0",
      relationship: "self",
      gender: formData.gender
    };

    this.service.postMethod('users/create', JSON.stringify(data)).subscribe(response => {
      this.loader = false;
      if (!response.error) {
        const message = `${response.data.fname} ${response.data.lname} has been added successfully`;
        Swal.fire(message, 'success');
        this.router.navigate(['/dashboard/users']);
      } else {
        Swal.fire(response.message, 'error');
      }
    }, error => {
      this.loader = false;
      console.error(error);
    });
  }
}
