import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';
import { map } from 'rxjs';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderPageComponent {
  paginationService = inject(PaginationService)
  gender = signal<string>('')
  productService = inject(ProductsService)
  activatedRoute = inject(ActivatedRoute).paramMap.subscribe((params) => {
    this.gender.set(params.get('gender') ?? '')
  })

  productsResource = rxResource({
    params: () => ({ gender: this.gender(), page: this.paginationService.currentPage() - 1 }),
    stream: (params) => {
      return this.productService.getProducts({ gender: params.params.gender, offset: params.params.page * 9 })
    }
  })
}
