import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { ProductStore } from '../storage/product-store';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private http = inject(HttpClient);
    private productStore = inject(ProductStore);

    public async getAllProducts(): Promise<ProductModel[]> {

        // If we have all products in global store - return them: 
        if (this.productStore.count()) return this.productStore.products();

        // Create observable which can fetch data from the given address: 
        const products$ = this.http.get<ProductModel[]>(environment.productsUrl); // Returns observable

        // Convert the observable into promise and fetch the data: 
        const products = await firstValueFrom(products$);

        // Init all products in global store: 
        this.productStore.initProducts(products);

        // Return the data: 
        return products;
    }

    public async getOneProduct(id: number): Promise<ProductModel> {

        // If product exists in global store - return it: 
        const product = this.productStore.products().find(p => p.id === id);
        if (product) return product;

        // Create observable which can fetch data from the given address: 
        const product$ = this.http.get<ProductModel>(environment.productsUrl + id);

        // Convert the observable into promise and fetch the data: 
        const dbProduct = await firstValueFrom(product$);

        // Return the data: 
        return dbProduct;
    }

    public async addProduct(product: ProductModel): Promise<void> {

        // Create observable which can post data to backend:
        const dbProduct$ = this.http.post<ProductModel>(environment.productsUrl, ProductModel.toFormData(product));

        // Convert the observable into promise and post the data: 
        const dbProduct = await firstValueFrom(dbProduct$);

        // Add db product to the global state: 
        this.productStore.addProduct(dbProduct);
    }

    public async updateProduct(product: ProductModel): Promise<void> {

        // Create observable which can post data to backend:
        const dbProduct$ = this.http.put<ProductModel>(environment.productsUrl + product.id, ProductModel.toFormData(product));

        // Convert the observable into promise and post the data: 
        const dbProduct = await firstValueFrom(dbProduct$);

        // Update db products in global state: 
        this.productStore.updateProduct(dbProduct);
    }

    public async deleteProduct(id: number): Promise<void> {

        // Create observable which can delete data in backend:
        const observable$ = this.http.delete(environment.productsUrl + id);

        // Convert the observable into promise and delete the data: 
        await firstValueFrom(observable$);

        // Delete product from global state: 
        this.productStore.deleteProduct(id);
    }

    // // Get top three products without interceptor, by sending token here (not recommended)
    // public async getTopThreeProducts(): Promise<ProductModel[]> {

    //     // Take token: 
    //     const token = localStorage.getItem("token");

    //     // authorization: "Bearer the-token"
    //     const headers = new HttpHeaders().set("authorization", "Bearer " + token);

    //     // Create observable which can fetch data from the given address: 
    //     const products$ = this.http.get<ProductModel[]>(environment.topThreeProductsUrl, { headers }); 

    //     // Convert the observable into promise and fetch the data: 
    //     const products = await firstValueFrom(products$);

    //     // Return the data: 
    //     return products;
    // }

    // Get top three products using interceptor (recommended):
    public async getTopThreeProducts(): Promise<ProductModel[]> {

        const products$ = this.http.get<ProductModel[]>(environment.topThreeProductsUrl); 

        // Convert the observable into promise and fetch the data: 
        const products = await firstValueFrom(products$);

        // Return the data: 
        return products;
    }
}

