import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductsService } from '@products/services/products.service';
import { FormUtils } from '@utils/form.utils';



@Component({
  selector: 'app-product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  sizes = ["L", "M", "S", "XL", "XS", "XXL"]
  product = input.required<Product>()
  formUtils = FormUtils
  productService = inject(ProductsService)

  fb = inject(FormBuilder)
  productForm = this.fb.group({
    title: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [[''], [Validators.required]],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kids|unisex/)]],
  })

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(formLike as any);
    // this.productForm.patchValue(formLike as any)
    this.productForm.patchValue({ tags: formLike.tags?.join(",") })
  }


  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1)
    }
    else {
      currentSizes.push(size)
    }
    this.productForm.patchValue({ sizes: currentSizes })
  }

  onSumbit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched()
      return
    }
    const formValue = this.productForm.value
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
      id: this.product().id
    }
    console.log(productLike)
    this.productService.updateProduct(productLike).subscribe()
  }

}
