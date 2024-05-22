import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public form: FormGroup;
  public oldPassword: string;
  public password: string;
  public repassword: string;
  public isCheked = false;
  public message = 'Password Did Not Match';
  public errorMsg: string;
  public loader = false;
  public show = false;
  public repeatshow = false;
  private loginId = localStorage.getItem('loginId');

  constructor(
    private router: Router,
    private service: Service,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      opassword: [null, Validators.required],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      rpassword: [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  togglePasswordVisibility(): void {
    this.show = !this.show;
  }

  toggleRepeatPasswordVisibility(): void {
    this.repeatshow = !this.repeatshow;
  }

  passwordMatch(): void {
    this.isCheked = this.password !== this.repassword;
    if (this.isCheked) {
      this.errorMsg = this.message;
    }
  }

  changePassword(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loader = true;
    const data = {
      oldpassword: this.oldPassword,
      newpassword: this.password,
      userid: this.loginId
    };

    this.service.postMethod('users/change/password', JSON.stringify(data))
      .subscribe(response => {
        this.loader = false;
        if (!response.error) {
          Swal.fire('Success', response.message, 'success');
          this.router.navigate(['/dashboard/users']);
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      }, error => {
        this.loader = false;
        console.error(error);
        Swal.fire('Error', 'An unexpected error occurred. Please try again later.', 'error');
      });
  }
}
