import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

    public isDev = environment.isDevelopment;

    @ViewChild("lazyContainer", { read: ViewContainerRef })
    public viewContainerRef: ViewContainerRef;

    public async showSale(): Promise<void> {

        // Clean container from previous component: 
        this.viewContainerRef.clear();

        // Lazy load the component from the backend: 
        const { SaleComponent } = await import("../sale/sale.component");

        // Inject the lazy component to the DOM: 
        this.viewContainerRef.createComponent(SaleComponent);
    }
}
