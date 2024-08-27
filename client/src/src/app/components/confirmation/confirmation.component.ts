import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  public order: any;

  constructor(private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    // Get the order data from the router state
    this.order = history.state.order;
    this.cartService.setCartCount(0);
    // If order data is not available, you can redirect the user or handle the case accordingly.
    if (!this.order) {
      // Handle the case where the order data is missing (optional)
    }
  }
}
