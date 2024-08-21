import { Component, HostListener } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public hideHeader: boolean = false;

  public mobileMenuOpen: boolean = false;

  public cartCount$ = this.cartService.getCartCount();

  constructor(private cartService: CartService) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const currentScrollPos = window.pageYOffset;
    this.hideHeader = currentScrollPos > 100;
  }

  public toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
