import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { ProductModel } from "../models/product.model"
import { computed } from "@angular/core";
import { withDevtools } from "@angular-architects/ngrx-toolkit";
import { environment } from "../../environments/environment";

// Creating the type of the data which lives in the app level: 
export type ProductState = {
    products: ProductModel[];
};

// Creating the initial data: 
const initialState: ProductState = {
    products: []
};

// Creating the store - managing the above state: 
export const ProductStore = signalStore(

    // Creating ProductStore as a service in the app level:
    { providedIn: "root" },

    // Initial data: 
    withState(initialState),

    // Operation needed on this global state (init, add, update, delete):
    withMethods(store => ({

        // Init products given from backend: 
        initProducts(products: ProductModel[]): void {
            patchState(store, _currentState => ({ products })); // Replace the [] with given products.
        },

        // Add new product to global state: 
        addProduct(product: ProductModel): void {
            patchState(store, currentState => ({ products: [...currentState.products, product] })); // Duplicate products and add the new one.
        },

        // Update existing product in global state: 
        updateProduct(product: ProductModel): void {
            patchState(store, currentState => ({ products: currentState.products.map(p => p.id === product.id ? product : p) })); // Duplicate products but with the updated one.
        },

        // Delete existing product from global state: 
        deleteProduct(id: number): void {
            patchState(store, currentState => ({ products: currentState.products.filter(p => p.id !== id) })); // Duplicate products but without the deleted one.
        },

    })),

    // Create computed values: 
    withComputed(store => ({

        // Product count: 
        count: computed(() => store.products().length),

        // In-Stock products: 
        inStockProducts: computed(() => store.products().filter(p => p.stock > 0))

    })),

    // Adding reports to debug tool: 
    environment.isDevelopment && withDevtools("ProductStore")

);


