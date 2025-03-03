export class ProductModel {
    public id: number;
    public name: string;
    public price: number;
    public stock: number;
    public imageUrl: string;
    
    public image: File; // Image to send to backend.

    // Convert product to FormData so it could send files:
    public static toFormData(product: ProductModel): FormData {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price.toString());
        formData.append("stock", product.stock.toString());
        formData.append("image", product.image);
        return formData;
    }

}
