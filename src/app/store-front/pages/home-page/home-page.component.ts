import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '@shared/components/pagination.service';
@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  paginationService = inject(PaginationService)
  private productsService = inject(ProductsService)

  // activatedRoute = inject(ActivatedRoute)
  // page = toSignal(this.activatedRoute.queryParamMap.pipe(
  //   map(params => (params.get('page') ? +params.get('page')! : 1)),
  //   map(page => (isNaN(page) ? 1 : page))
  // ), {
  //   initialValue: 1
  // })

  productsResource = rxResource({
    params: () => (this.paginationService.currentPage()),
    stream: (res) => {
      console.log(res.params)
      return this.productsService.getProducts({ offset: (res.params - 1) * 9 });
    }
  })
}
