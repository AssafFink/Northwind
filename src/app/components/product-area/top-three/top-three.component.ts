import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { NotifyService } from '../../../services/notify.service';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-top-three',
    imports: [CommonModule],
    templateUrl: './top-three.component.html',
    styleUrl: './top-three.component.css'
})
export class TopThreeComponent implements OnInit {

    public products: ProductModel[] = [];

    public constructor(
        private productService: ProductService,
        private router: Router,
        private notifyService: NotifyService
    ) { }

    public async ngOnInit() {
        try {
            this.products = await this.productService.getTopThreeProducts();
        }
        catch (err: any) {
            this.notifyService.error(err);
        }
    }

    public displayDetails(id: number) {        
        this.router.navigateByUrl("/products/" + id); // or this.router.navigate(["/product-details"]);
    }

}
