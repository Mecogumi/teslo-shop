import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  currentPage = input<number>(1)
  pages = input<number>(0)

  getPagesArray = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1)
  });
}
