import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsTableComponent } from '@products/components/products-table/products-table.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '../../../shared/components/pagination.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-produts-admin-page',
  imports: [ProductsTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService)
  paginaitonService = inject(PaginationService)
  productLimit = signal<number>(10)

  productsResource = rxResource({
    params: () => ({ limit: this.productLimit(), pagination: this.paginaitonService.currentPage() - 1 }),
    stream: ({ params }) => this.productsService.getProducts({
      offset: params.pagination * 9,
      limit: params.limit
    })
  })
}
