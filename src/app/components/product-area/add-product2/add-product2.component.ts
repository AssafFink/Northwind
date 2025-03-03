import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { extraSpacing } from '../../../utils/validators';
import { NotifyService } from '../../../services/notify.service';

@Component({
    selector: 'app-add-product2',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './add-product2.component.html',
    styleUrl: './add-product2.component.css'
})
export class AddProduct2Component implements OnInit {

    private product = new ProductModel();
    public productForm: FormGroup; // Represent entire form.
    @ViewChild("productImage")
    public productImageRef: ElementRef<HTMLInputElement>;

    public constructor(
        private productService: ProductService,
        private router: Router,
        private formBuilder: FormBuilder, // Create form parts bounded to the form controls.
        private notifyService: NotifyService
    ) { }

    public ngOnInit(): void {
        this.productForm = this.formBuilder.group({
            nameControl: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50), extraSpacing()]),
            priceControl: new FormControl("", [Validators.required, Validators.min(0), Validators.max(1000)]),
            stockControl: new FormControl("", [Validators.required, Validators.min(0), Validators.max(1000)]),
            imageControl: new FormControl("", [Validators.required])
        });
    }

    public async send() {
        try {
            this.product.name = this.productForm.get("nameControl").value;
            this.product.price = this.productForm.get("priceControl").value;
            this.product.stock = this.productForm.get("stockControl").value;
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
