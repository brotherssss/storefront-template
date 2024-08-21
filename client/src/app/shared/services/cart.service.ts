import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface CartItem {
  id: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private storage: Storage = localStorage;

  private cartIdKey = 'cartId'; // Key for storing cart ID in localStorage

  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  //private baseUrl = 'http://localhost:9000';

  private baseUrl = 'http://212.5.157.254:9000';

  public cart$ = this.cartSubject.asObservable();

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
          this.cartSubject.next(cart.items);
          return cart;
        })
      );
  }

  public getCartProducts(): Observable<any[]> {
    return this.fetchCart().pipe(map((cart) => (cart ? cart.cart.items : [])));
  }

  public getCartCount(): Observable<number> {
    return this.fetchCart().pipe(
      map((cart) =>
        cart
          ? cart.cart.items.reduce(
              (total: number, item: any) => total + item.quantity,
              0
            )
          : 0
      )
    );
  }

  private loadCartFromLocalStorage(): void {
    const cartId = this.cartId;
    if (cartId) {
      this.fetchCart().subscribe(cart => {
        if (cart) {
          this.cartSubject.next(cart.items);
        }
      });
    }
  }
}
