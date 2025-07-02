import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageComponent {
  productSlug = signal<string>('')
  productService = inject(ProductsService)
  activatedRoute = inject(ActivatedRoute).paramMap.subscribe((value) => {
    this.productSlug.set(value.get('idSlug') ?? '')
  })



  productResource = rxResource({
    params: () => (this.productSlug()),
    stream: (slug) => {
      console.log(slug.params)
      return this.productService.getProduct(slug.params)
    }
  })

  // constructor() {
  //   setInterval(() => {
  //     console.log(this.productSlug)
  //   }, 1000);
  // }
}
