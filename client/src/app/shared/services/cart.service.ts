import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { environment } from "../../../environments/environment.development";

interface CartItem {
  id: string;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private storage: Storage = localStorage;

  private cartIdKey = "cartId"; // Key for storing cart ID in localStorage

  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  private baseUrl = environment.apiUrl;

  public cart$ = this.cartSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);

  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromLocalStorage();
  }

  private get cartId(): string | null {
    return this.storage.getItem(this.cartIdKey);
  }

  private set cartId(value: string | null) {
    if (value) {
      this.storage.setItem(this.cartIdKey, value);
    } else {
      this.storage.removeItem(this.cartIdKey);
    }
  }

  public getCartId(): string | null {
    return this.cartId;
  }

  public updateCustomerInfo(
    email: string,
    shippingData: any
  ): Observable<any> {
    if (!this.cartId) return of(null); // Handle the case where there's no cart ID

    const url = `${this.baseUrl}/store/carts/${this.cartId}`;
    return this.http.post(url, {
      email: email,
      shipping_address: shippingData,
    });
  }

  public createPaymentSession(): Observable<any> {
    if (!this.cartId) return of(null);

    const url = `${this.baseUrl}/store/carts/${this.cartId}/payment-sessions`;
    return this.http.post(url, {});
  }

  public completeOrder(paymentMethod: string): Observable<any> {
    if (!this.cartId) return of(null);

    const url = `${this.baseUrl}/store/carts/${this.cartId}/complete`;
    return this.http.post(url, {
      payment_method: paymentMethod,
    });
  }

  public removeItem(lineItemId: string): Observable<any> {
    return this.http
      .delete<any>(
        `${this.baseUrl}/store/carts/${this.cartId}/line-items/${lineItemId}`
      )
      .pipe(
        map((cart) => {
          this.calculateCount(cart);
          this.cartSubject.next(cart.items);
          return cart;
        })
      );
  }

  public updateQuantity(lineItemId: string, quantity: number): Observable<any> {
    return this.http
      .post<any>(
        `${this.baseUrl}/store/carts/${this.cartId}/line-items/${lineItemId}`,
        { quantity }
      )
      .pipe(
        map((cart) => {
          this.calculateCount(cart);
          this.cartSubject.next(cart.items);
          return cart;
        })
      );
  }

  private fetchCart(): Observable<any> {
    if (!this.cartId) {
      return of(null); // Return an empty observable if no cart ID
    }
    return this.http.get<any>(`${this.baseUrl}/store/carts/${this.cartId}`);
  }

  public createCart(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/store/carts`, {}).pipe(
      map((cart) => {
        this.cartId = cart.cart.id;
        this.cartSubject.next(cart.cart.items);
        return cart;
      })
    );
  }

  public addToCart(productId: string, quantity: number): Observable<any> {
    if (!this.cartId) {
      return this.createCart().pipe(
        switchMap(() => this.addToCart(productId, quantity))
      );
    }
    return this.http
      .post<any>(`${this.baseUrl}/store/carts/${this.cartId}/line-items`, {
        variant_id: productId,
        quantity,
      })
      .pipe(
        map((cart) => {
          this.calculateCount(cart);
          this.cartSubject.next(cart.items);
          return cart;
        })
      );
  }

  public getCartProducts(): Observable<any[]> {
    return this.fetchCart().pipe(map((cart) => (cart ? cart.cart.items : [])));
  }

  private loadCartFromLocalStorage(): void {
    const cartId = this.cartId;
    if (cartId) {
      this.fetchCart().subscribe((cart) => {
        if (cart) {
          this.calculateCount(cart);
          this.cartSubject.next(cart.items);
        }
      });
    }
  }

  private calculateCount(cart: any) {
    if(!cart) return;
    const count =  cart
    ? cart.cart.items.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      )
    : 0
    this.cartCountSubject.next(count);
  }

  public placeOrder(orderData: any) {
    return this.http.post(`${this.baseUrl}/store/orders`, orderData);
  }
}
