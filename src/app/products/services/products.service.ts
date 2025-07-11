import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '../interfaces/product-response.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiUrl = environment.baseUrl
interface Options {
  limit?: number
  offset?: number
  gender?: string
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient)

  private productsCache = new Map<string, ProductsResponse>()
  private productCache = new Map<string, Product>

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 10, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`
    if (this.productCache.has(key)) {
      return of(this.productsCache.get(key) as ProductsResponse);
    }
    return this.http.get<ProductsResponse>(`${apiUrl}/products`, {
      params: { limit, offset, gender }
    }).pipe(
      tap(resp => this.productsCache.set(key, resp))
    )
  }

  getProduct(query: string): Observable<Product> {
    if (this.productCache.has(query)) {
      return of(this.productCache.get(query) as Product)
    }
    return this.http.get<Product>(`${apiUrl}/products/${query}`).pipe(
      tap(resp => this.productCache.set(query, resp))
    )
  }

  getProductById(id: string): Observable<Product> {
    if (this.productCache.has(id)) {
      return of(this.productCache.get(id) as Product)
    }
    return this.http.get<Product>(`${apiUrl}/products/${id}`).pipe(
      tap(resp => this.productCache.set(id, resp))
    )
  }

  updateProduct(productLike: Partial<Product>): Observable<Product> {
    const id = productLike.id!
    return this.http.patch<Product>(`${apiUrl}/products/${id}`, productLike).pipe(
      tap(resp => this.updateProductCache(resp))
    )
  }

  updateProductCache(product: Product) {
    const id = product.id
    this.productCache.set(id, product)
  }

}
