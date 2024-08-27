import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;

  @Input() totalPages: number = 1;
  
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  public changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

}
