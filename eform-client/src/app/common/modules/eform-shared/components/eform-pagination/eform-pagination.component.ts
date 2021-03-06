import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, range } from 'rxjs';
import { filter, map, toArray } from 'rxjs/operators';
import { PaginationModel } from 'src/app/common/models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'eform-pagination',
  templateUrl: './eform-pagination.component.html',
  styleUrls: ['./eform-pagination.component.scss'],
})
export class EformPaginationComponent implements OnInit, OnChanges {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onPageChanged: EventEmitter<number> = new EventEmitter<number>();
  @Input() offset = 0;
  @Input() limit = 1;
  @Input() size = 1;
  @Input() range = 3;
  @Input() pagination: PaginationModel;
  currentPage: number;
  totalPages: number;
  pages: Observable<number[]>;

  selectPage(page: number) {
    if (this.isValidPageNumber(page, this.totalPages)) {
      this.onPageChanged.emit((page - 1) * this.limit);
    } else {
      return;
    }
  }

  getPages(offset: number, limit: number, size: number) {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.totalPages = this.getTotalPages(limit, size);
    this.pages = range(-this.range, this.range * 2 + 1).pipe(
      map((offsetLocal) => this.currentPage + offsetLocal),
      filter((page) => this.isValidPageNumber(page, this.totalPages)),
      toArray()
    );
  }

  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pagination && !changes.pagination.firstChange) {
      if (this.pagination) {
        this.offset = this.pagination.offset;
        this.limit = this.pagination.pageSize;
        this.size = this.pagination.total;
      }
      this.getPages(this.offset, this.limit, this.size);
    }
  }

  ngOnInit() {
    if (this.pagination) {
      this.offset = this.pagination.offset;
      this.limit = this.pagination.pageSize;
      this.size = this.pagination.total;
    }
    this.getPages(this.offset, this.limit, this.size);
  }
}
