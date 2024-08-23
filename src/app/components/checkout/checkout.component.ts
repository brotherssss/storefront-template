import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CartService } from "../../shared/services/cart.service";
import { Router } from "@angular/router";
import { switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  public checkoutForm: FormGroup;

  public cartItems: any[] = [];

  public totalAmount: number = 0;

  public cartId!: string;

  public loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      postalCode: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
    });
  }

  public ngOnInit(): void {
    this.cartService.getCartProducts().subscribe((items) => {
      this.cartItems = items;
      this.totalAmount = this.cartItems.reduce((total, item) => {
        return total + (item.quantity * item.unit_price) / 100;
      }, 0);
    });

    this.cartId = this.cartService.getCartId()!;
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      const email: string = this.checkoutForm.value.email;
      const shippingAddress = {
        first_name: this.checkoutForm.value.firstName,
        last_name: this.checkoutForm.value.lastName,
        address_1: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        postal_code: this.checkoutForm.value.postalCode,
        phone: this.checkoutForm.value.phone,
      };
      this.cartService
        .updateCustomerInfo(email, shippingAddress)
        .pipe(
          switchMap(() => this.cartService.createPaymentSession()),
          switchMap(() =>
            this.cartService.completeOrder(
              this.checkoutForm.value.paymentMethod
            )
          )
        )
        .subscribe(
          (response: any) => {
            this.loading = false;
            this.toastr.success("Order placed successfully!");
            localStorage.removeItem('cartId');
            this.router.navigate(["/confirmation"], {
              state: { order: response.data },
            });
          },
          (error) => {
            this.loading = false;
            console.error("Error placing order:", error);
          }
        );
    }
  }
}
