import { Component } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  public products: any[] = [];

  public currentPage: number = 1;

  public totalPages: number = 1;

  public pageSize: number = 4;

  public categories: any = {};

  constructor(private productsSvc: ProductsService) {}

 public ngOnInit() {
    this.loadProducts();
  }

  public loadProducts() {
    this.productsSvc.fetchProducts(this.currentPage, this.pageSize, this.categories).subscribe(
      data => {
        this.products = data.products;
        this.totalPages = Math.ceil(data.total / this.pageSize);
      },
      error => console.error('Error fetching products:', error)
    );
  }

  public onPageChange(page: any) {
    this.currentPage = page;
    this.loadProducts();
  }

  public onCategoryChange(categories: any): void {
    this.categories = categories;
    this.currentPage = 1;
    this.loadProducts();
  }
}
