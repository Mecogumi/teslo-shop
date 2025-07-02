import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '../interfaces/product-response.interface';
import { Observable } from 'rxjs';
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
  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 10, offset = 0, gender = '' } = options;
    return this.http.get<ProductsResponse>(`${apiUrl}/products`, {
      params: { limit, offset, gender }
    })
  }

  getProduct(query: string) {
    return this.http.get<Product>(`${apiUrl}/products/${query}`)
  }

}
