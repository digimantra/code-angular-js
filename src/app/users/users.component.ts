import { Component, OnInit } from '@angular/core';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { Service } from "../services/service.service";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userList: Array<any> = [];
  p: number;
  status: Array<any> = [
    'All',
    'Active',
    'In-active'
  ];
  textStatusVal:any;
  updateStatusVal:any;
  pageVal:any = '1';
  changeStatusVal:string = '';
  searchVal: string = '';
  showError: boolean; 
  errorMsg: string;
  query:string = '';
  page = 1; 
  itemsPerPage = 10;
  totalItems : any;
  selectedStatus = 'All';
  loader = true;

  constructor(
    private Service: Service,

  ) { 
    this.getData();

  }

  ngOnInit() {
  }
 
  //Delete user
  deleteUser(userId , name) {
    Swal.fire({
      // title: 'Are you sure?',
      text: "Are you sure? you want to delete " + name + '!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader = true; 
        this.Service.deleteMethod('users/delete/'+ userId).subscribe(response => {
          console.log(response);
          if (response.error == false) {
            console.log(response.data);
            this.getData();
            this.loader = false; 
          }
          this.loader = false; 
        });
        Swal.fire(
          'Deleted!',
          'User has been deleted.',
          'success'
        )
      }
    })

    
  }

  getData() {
    this.loader = true;
    // pages = 1
    // status = all
    // search = ''
    this.Service.getMethod('users?page=1&status=all&search=')
    .subscribe((response => {
      if (response.error == false) {
        this.userList = response.data;
        this.page =  1
        this.totalItems = response.total_rows;
        this.showError = false;
        this.loader = false;
      }
      else {
        this.loader = false;
        this.showError = true;
        this.errorMsg = response.message;
      }
    }),
      (error) => {
        this.errorMsg = error.error.message;
        console.log("api error- ",error.error.message);

      }
    )
  }

  getPageData(pages: any){
    this.loader = true; 
    this.userList = [];
   //page value
   this.pageVal = pages;
   //status value 
   if(this.changeStatusVal != ''){
      this.changeStatusVal = this.changeStatusVal;
   }else{
     this.changeStatusVal = 'all';
   }
   //search value
   if(this.searchVal != ''){
    this.searchVal = this.searchVal;
   }else{
      this.searchVal = '';
   } 
    this.Service.getMethod('users?page=' + this.pageVal + '&status=' + this.changeStatusVal + '&search=' + this.searchVal)
    .subscribe((response => {
      if (response.error == false) {
        this.userList = response.data;
        this.page =  pages;
        this.totalItems = response.total_rows;
        this.showError = false;
        console.log(this.userList);
        this.loader = false; 
      }
      else {
        this.loader = false; 
        this.showError = true;
        this.errorMsg = response.message;
      }
    }),
      (error) => {
        this.loader = false; 
        this.errorMsg = error.error.message;
        console.log("api error- ",error.error.message);

      }
    )
  }
  searchFilter(event) {
    this.loader = true; 
    this.userList = [];
    //page
    if(this.pageVal != ''){
      this.pageVal = this.pageVal;
    }else{
      this.pageVal = '1';
    }
    //status value 
    if(this.changeStatusVal != ''){
      this.changeStatusVal = this.changeStatusVal;
    }else{
      this.changeStatusVal = 'all';
    }
    //search value
    this.searchVal = event.target.value;

    this.Service.getMethod('users?page=' + '1' + '&status=' + this.changeStatusVal + '&search='+ this.searchVal)
    .subscribe((response => {
      if (response.error == false) {
        this.userList = response.data;
        this.page =  1;
        this.totalItems = response.total_rows;
        this.showError = false;
        console.log(this.userList);
        this.loader = false; 
      }
      else {
        this.loader = false; 
        this.showError = true;
        this.errorMsg = response.message;
      }
    }),
      (error) => {
        this.loader = false; 
        this.errorMsg = error.error.message;
        console.log("api error- ",error.error.message);

      }
    )
    
  }
  changeUserStatus(fieldValue: string) {
    // this.loader = true; 
    this.userList = [];
    //page
    if(this.pageVal != ''){
      this.pageVal = this.pageVal;
    }else{
      this.pageVal = '1';
    }
    //status
    if(fieldValue == 'Active'){
      this.changeStatusVal = '0';
    }else if(fieldValue == 'In-active'){
      this.changeStatusVal = '1';
    }else{
      this.changeStatusVal = 'all';
    }
    //search value
    if(this.searchVal != ''){
      this.searchVal = this.searchVal;
    }else{
        this.searchVal = '';
    } 
    this.loader = true; 
    this.Service.getMethod('users?page=' + '1'
    + '&status=' + this.changeStatusVal + '&search=' + this.searchVal)
    .subscribe((response => {
      if (response.error == false) {
        this.userList = response.data;
        this.page =  1;
        this.totalItems = response.total_rows;
        this.showError = false;
        console.log(this.userList);
        this.loader = false; 
      }
      else {
        this.loader = false; 
        this.showError = true;
        this.errorMsg = response.message;
      }
    }),
      (error) => {
        this.loader = false; 
        this.errorMsg = error.error.message;
        console.log("api error- ",error.error.message);

      }
    )
    
  }
  updateUserStatus(status,userid){
    // this.loader = true; 
    if(status == '0'){
      this.updateStatusVal = '1';
      this.textStatusVal = 'in-active';
    }else if(status == '1'){
      this.updateStatusVal = '0';
      this.textStatusVal = 'active';
    }else{
      this.updateStatusVal = '0';
      this.textStatusVal = 'active';
    }
    let data = {
      "ustatus": this.updateStatusVal,
      "status": this.textStatusVal
    }
    Swal.fire({
      // title: 'Are you sure?',
      text: "Are you sure? you want to change user status!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.putMethod('users/update/status/'+ userid, JSON.stringify(data))
    .subscribe((response => {
      if (response.error == false) {
        this.loader = false; 
        this.getData();
      }
      else {
        this.loader = false; 
        this.showError = true;
        this.errorMsg = response.message;
      }
    }),
      (error) => {
        this.loader = false; 
        this.errorMsg = error.error.message;
        console.log("api error- ",error.error.message);

      }
    )
      }
      this.loader = false; 
    })
    
  }

}
