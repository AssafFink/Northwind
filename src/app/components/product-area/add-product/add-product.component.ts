import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotifyService } from '../../../services/notify.service';

@Component({
    selector: 'app-add-product',
    imports: [FormsModule, CommonModule],
    templateUrl: './add-product.component.html',
    styleUrl: './add-product.component.css'
})
export class AddProductComponent {

    public product = new ProductModel();

    @ViewChild("productImage")
    public productImageRef: ElementRef<HTMLInputElement>;

    public constructor(
        private productService: ProductService,
        private router: Router,
        private notifyService: NotifyService
    ) { }

    public async send(valid: boolean) {
        try {
            if(!valid) {
                this.notifyService.error("Please correct the validation errors!");
                return;
            }
            this.product.image = this.productImageRef.nativeElement.files[0];
            await this.productService.addProduct(this.product);
            this.notifyService.success("Product has been added.");
            this.router.navigateByUrl("/products");
        }
        catch (err: any) {
            this.notifyService.error(err);
        }
    }

    public canceled = false;
    public dialogCanceled() {
        this.canceled = true;
    }
}
