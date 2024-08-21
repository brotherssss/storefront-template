import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../shared/services/products.service';
import { CartService } from '../../shared/services/cart.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  public product: any;

  public selectedVariant: string = '';

  public selectedVariantPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cartService: CartService
  ) {}

  public ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id')!;
    this.productService
      .getProductById(productId)
      .pipe(first())
      .subscribe((data) => {
        this.product = data.product;
        if (this.product.variants.length > 0) {
          this.selectedVariant = this.product.variants[0].id;
          this.selectedVariantPrice = this.product.variants[0].prices[0].amount;
        }
      });
  }

  public addToCart(): void {
    if (this.product && this.selectedVariant) {
      this.cartService.addToCart(this.selectedVariant, 1).subscribe();
    }
  }

  public onVariantChange(): void {
    const selectedVariantData = this.product.variants.find(
      (variant: any) => variant.id === this.selectedVariant
    );
    this.selectedVariantPrice = selectedVariantData
      ? selectedVariantData.prices[0].amount
      : 0;
  }
}
