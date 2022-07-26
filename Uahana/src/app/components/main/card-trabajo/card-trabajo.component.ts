import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-trabajo',
  templateUrl: './card-trabajo.component.html',
  styleUrls: ['./card-trabajo.component.css']
})
export class CardTrabajoComponent implements OnInit {

  constructor() { }

  @Input() titulo = "";
  @Input() descripcion = "";
  @Input() namePict = "";

  ngOnInit(): void {
  }

}
