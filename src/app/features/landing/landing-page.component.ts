import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';

import { BlogApiService } from '../../core/services/blog-api.service';
import { BlogDto, BlogPageResult } from '../../core/models/blog.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  blogs: BlogDto[] = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 6;
  isLoading = false;
  errorMessage = '';

  constructor(private readonly blogApiService: BlogApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.blogApiService.getPublicBlogs(this.currentPage, this.pageSize).subscribe({
      next: (result: BlogPageResult) => {
        this.blogs = result.items;
        this.totalCount = result.totalCount;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load blogs right now. Please try again later.';
        this.isLoading = false;

        this.cdr.markForCheck();
      },
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.loadBlogs();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.loadBlogs();
    }
  }
}
