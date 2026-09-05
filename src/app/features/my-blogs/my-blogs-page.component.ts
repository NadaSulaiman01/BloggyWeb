import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BlogApiService } from '../../core/services/blog-api.service';
import { BlogDto, BlogPageResult, BlogRequestDto } from '../../core/models/blog.model';

@Component({
  selector: 'app-my-blogs-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-blogs-page.component.html',
  styleUrl: './my-blogs-page.component.css',
})
export class MyBlogsPageComponent implements OnInit {
  blogs: BlogDto[] = [];
  formModel: BlogRequestDto = {
    title: '',
    content: '',
  };
  editingBlogId: string | null = null;
  currentPage = 1;
  pageSize = 5;
  totalCount = 0;
  isLoading = false;
  isSubmitting = false;
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

    this.blogApiService.getMyBlogs(this.currentPage, this.pageSize).subscribe({
      next: (result: BlogPageResult) => {
        this.blogs = result.items;
        this.totalCount = result.totalCount;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load your blogs. Please try again later.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    if (!this.formModel.title.trim() || !this.formModel.content.trim()) {
      this.errorMessage = 'Title and content are required.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload: BlogRequestDto = {
      title: this.formModel.title.trim(),
      content: this.formModel.content.trim(),
    };

    const request$ = this.editingBlogId
      ? this.blogApiService.updateBlog(this.editingBlogId, payload)
      : this.blogApiService.createBlog(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.loadBlogs();
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = this.editingBlogId
          ? 'Unable to update this blog.'
          : 'Unable to create a new blog.';
        this.isSubmitting = false;
      },
    });
  }

  editBlog(blog: BlogDto): void {
    this.editingBlogId = blog.id;
    this.formModel = {
      title: blog.title,
      content: blog.content,
    };
    this.errorMessage = '';
    window.scrollTo(0, 0);
  }

  deleteBlog(id: string): void {
    const blogToDelete = this.blogs.find((blog) => blog.id === id);

    if (!blogToDelete) {
      return;
    }

    const confirmed = window.confirm(`Delete "${blogToDelete.title}"?`);

    if (!confirmed) {
      return;
    }

    this.blogApiService.deleteBlog(id).subscribe({
      next: () => {
        if (this.blogs.length === 1 && this.currentPage > 1) {
          this.currentPage -= 1;
        }

        this.loadBlogs();
      },
      error: () => {
        this.errorMessage = 'Unable to delete this blog.';
      },
    });
  }

  resetForm(): void {
    this.editingBlogId = null;
    this.formModel = { title: '', content: '' };
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
