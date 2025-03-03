import { Component } from '@angular/core';
import { TotalProductsComponent } from "../../product-area/total-products/total-products.component";

@Component({
  selector: 'app-footer',
  imports: [TotalProductsComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
