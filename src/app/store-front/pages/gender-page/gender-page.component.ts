import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderPageComponent {
  gender = signal<string>('')
  productService = inject(ProductsService)
  activatedRoute = inject(ActivatedRoute).paramMap.subscribe((params) => {
    this.gender.set(params.get('gender') ?? '')
  })

  productsResource = rxResource({
    params: () => (this.gender()),
    stream: (gender) => {
      return this.productService.getProducts({ gender: gender.params })
    }
  })
}
