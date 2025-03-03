import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { NotifyService } from '../../../services/notify.service';

@Component({
    selector: 'app-product-details',
    imports: [CommonModule, RouterLink],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

    public product: ProductModel;

    public constructor(
        private activatedRoute: ActivatedRoute,
        private productService: ProductService,
        private router: Router,
        private notifyService: NotifyService
    ) { }

    public async ngOnInit() {
        try {
            const id = +this.activatedRoute.snapshot.params["id"];
            this.product = await this.productService.getOneProduct(id);
        }
        catch (err: any) {
            this.notifyService.error(err);
        }
    }
    
    public async deleteMe(id: number) {
        try {
            const sure = confirm("Are you sure?");
            if(!sure) return;
            await this.productService.deleteProduct(id);
            this.notifyService.success("Product has been deleted.");
            this.router.navigateByUrl("/products");
        }
        catch (err: any) {
            this.notifyService.error(err);
        }
    }

}
