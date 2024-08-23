import { Component, OnInit } from "@angular/core";
import { CartService } from "../../shared/services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  public cartItems: any[] = [];

  public totalAmount: number = 0;

  constructor(private cartService: CartService) {}

  public ngOnInit(): void {
    this.cartService.getCartProducts().subscribe((products) => {
      this.cartItems = products;
      this.calculateTotal();
    });
  }

  public updateQuantity(item: any, quantity: number): void {
    this.cartService.updateQuantity(item.id, quantity).subscribe(() => {
      item.quantity = quantity;
      this.calculateTotal();
    });
  }

  public removeItem(item: any): void {
    this.cartService.removeItem(item.id).subscribe(() => {
      this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
      this.calculateTotal();
    });
  }

  public calculateTotal() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.quantity * item.unit_price) / 100;
    }, 0);
  }
}
