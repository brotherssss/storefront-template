import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../shared/services/products.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public products: any[] = [];

  constructor(private productService: ProductsService) {}

  public ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  public loadFeaturedProducts(): void {
    this.productService.fetchProducts(1, 3).subscribe(
      data => {
        this.products = data.products;
      },
      error => console.error('Error fetching featured products:', error)
    );
  }
}
