import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = 'http://212.5.157.254:9000';
  //private baseUrl = 'http://localhost:9000';

  constructor(private http: HttpClient) {}

  public fetchProducts(
    page: number = 1,
    pageSize: number = 10,
    filters: any = {}
  ): Observable<any> {
    let params = new HttpParams()
      .set('offset', (page - 1) * pageSize)
      .set('limit', pageSize);

    if (filters?.category_id) {
      params = params.append('category_id[]', filters['category_id']);
    }

    return this.http
      .get<{ products: any[]; count: number }>(
        `${this.baseUrl}/store/products`,
        { params }
      )
      .pipe(
        map((response) => ({
          products: response.products,
          total: response.count,
        }))
      );
  }

  public getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/store/products/${id}`);
  }

  public fetchCategories(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/store/product-categories`);
  }
}
