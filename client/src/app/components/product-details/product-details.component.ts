import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../shared/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public product: any;

  public isLoading: boolean = true;

  public error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.fetchProductDetails(productId);
    });
  }

  public fetchProductDetails(productId: string): void {
    this.productService.getProductById(productId).subscribe(
      res => {
        this.product = res.product;
        this.isLoading = false;
      },
      error => {
        this.error = 'Failed to load product details.';
        this.isLoading = false;
      }
    );
  }
}
