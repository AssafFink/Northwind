import { Component, inject } from '@angular/core';
import { ProductStore } from '../../../storage/product-store';

@Component({
  selector: 'app-total-products',
  imports: [],
  templateUrl: './total-products.component.html',
  styleUrl: './total-products.component.css'
})
export class TotalProductsComponent {

    public productStore = inject(ProductStore);
    
}
