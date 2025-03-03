import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotifyService } from '../../../services/notify.service';

@Component({
    selector: 'app-edit-product',
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-product.component.html',
    styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {

    public product: ProductModel;

    @ViewChild("productImage")
    public productImageRef: ElementRef<HTMLInputElement>;

    public constructor(private productService: ProductService,
        private activatedRoute: ActivatedRoute,
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

    public async send() {
        try {
            
            this.product.image = this.productImageRef.nativeElement.files[0];
            await this.productService.updateProduct(this.product);
            this.notifyService.success("Product has been updated.");
            this.router.navigateByUrl("/products");
        }
        catch (err: any) {
            this.notifyService.error(err);
        }
    }

}
