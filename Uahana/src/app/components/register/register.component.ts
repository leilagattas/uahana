import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  checkedEmp: boolean = true;
  checkedCliente: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  changeCheck() {
    this.checkedEmp = !this.checkedEmp;
    this.checkedCliente = !this.checkedCliente;
  }
}
