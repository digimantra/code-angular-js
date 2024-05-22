import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userService } from '../services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loader = false;
  show = false;
  repeatshow = false;
  errorMsg = '';
  message = "Password Did Not Match";
  isCheked = false;

  constructor(
    private router: Router,
    private service: userService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      fname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
      lname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
      emailid: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rpassword: ['', [Validators.required, Validators.minLength(6)]],
      contactnumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      gender: ['', Validators.required]
    });
  }

  passwords() {
    this.show = !this.show;
  }

  repeatpasswords() {
    this.repeatshow = !this.repeatshow;
  }

  passwordMatch() {
    const password = this.form.get('password')?.value;
    const rpassword = this.form.get('rpassword')?.value;
    
    this.isCheked = password !== rpassword;
    this.errorMsg = this.isCheked ? this.message : '';
  }

  addUser() {
    this.loader = true;
    const formData = this.form.value;
    const data = {
      fname: formData.fname,
      lname: formData.lname,
      emailid: formData.emailid,
      password: formData.password,
      contactno: formData.contactnumber,
      createdby: "1",
      parentid: "0",
      relationship: "self",
      gender: formData.gender
    };

    this.service.postMethod('users/create', JSON.stringify(data))
      .subscribe({
        next: (response) => {
          if (!response.error) {
            const message = `${response.data.fname} ${response.data.lname} has been added successfully`;
            Swal.fire('Success', message, 'success');
            this.router.navigate(['/dashboard/users']);
          } else {
            Swal.fire('Error', response.message, 'error');
          }
          this.loader = false;
        },
        error: (error) => {
          console.error('Error:', error);
          Swal.fire('Error', 'An error occurred. Please try again later.', 'error');
          this.loader = false;
        }
      });
  }
}
