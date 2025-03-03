import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ProductModel } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotifyService } from '../../../services/notify.service';

@Component({
    selector: 'app-product-list',
    imports: [CommonModule],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

    public products: ProductModel[] = [];

    public constructor(
        private productService: ProductService,
        private router: Router,
        private notifyService: NotifyService
    ) { }

    public async ngOnInit() {
        try {
            this.products = await this.productService.getAllProducts();
        }
        catch (err: any) {
            this.notifyService.error(err);
        }
    }

    public displayDetails(id: number) {        
        this.router.navigateByUrl("/products/" + id); // or this.router.navigate(["/product-details"]);
    }

}
