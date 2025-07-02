import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiUrl = environment.baseUrl

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {

  transform(value: string | string[]): string {
    // if (typeof value === 'string') return `${apiUrl}/files/product/${value}`
    // const image = value.at(0)

    // if (!image) {
    //   return "./assets/images/placeholder/no-image.jpg"
    // }
    // return `${apiUrl}/files/product/${image}`

    if (value.length === 0) return "./assets/images/placeholder/no-image.jpg"
    if (value instanceof Array) return `${apiUrl}/files/product/${value[0]}`
    return `${apiUrl}/files/product/${value}`
  }

}
