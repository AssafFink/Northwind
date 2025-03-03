import { Component } from '@angular/core';

@Component({
  selector: 'app-sale',
  imports: [],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {

    public percent = Math.floor(Math.random() * 15 + 5);

}
