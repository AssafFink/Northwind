import { Routes } from '@angular/router';
import { ContactUsComponent } from './components/page-area/contact-us/contact-us.component';
import { HomeComponent } from './components/page-area/home/home.component';
import { Page404Component } from './components/page-area/page-404/page-404.component';
import { AddProduct2Component } from './components/product-area/add-product2/add-product2.component';
import { EditProductComponent } from './components/product-area/edit-product/edit-product.component';
import { ProductDetailsComponent } from './components/product-area/product-details/product-details.component';
import { ProductListComponent } from './components/product-area/product-list/product-list.component';
import { TopThreeComponent } from './components/product-area/top-three/top-three.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [

    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "products", component: ProductListComponent },
    { path: "top-three", component: TopThreeComponent, canActivate: [authGuard] },
    { path: "products/new", component: AddProduct2Component },
    { path: "products/:id", component: ProductDetailsComponent },
    { path: "products/edit/:id", component: EditProductComponent },
    { path: "contact-us", component: ContactUsComponent },
    { path: "register", loadComponent: () => import("./components/user-area/register/register.component").then(m => m.RegisterComponent) }, // Lazy Loading
    { path: "login", loadComponent: () => import("./components/user-area/login/login.component").then(m => m.LoginComponent) }, // Lazy Loading
    { path: "**", component: Page404Component }

];
