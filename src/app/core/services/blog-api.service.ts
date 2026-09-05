import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { appConfiguration } from '../config/app-config';
import { BlogDto, BlogPageResult, BlogRequestDto, PagedResultDto } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogApiService {
  private readonly apiBaseUrl = `${appConfiguration.apiBaseUrl}api/Blogs`;

  constructor(private readonly http: HttpClient) {}

  getPublicBlogs(pageNumber: number, pageSize: number): Observable<BlogPageResult> {
    return this.getPagedBlogs(`${this.apiBaseUrl}`, pageNumber, pageSize);
  }

  getMyBlogs(pageNumber: number, pageSize: number): Observable<BlogPageResult> {
    return this.getPagedBlogs(`${this.apiBaseUrl}/my`, pageNumber, pageSize);
  }

  createBlog(blog: BlogRequestDto): Observable<BlogDto> {
    return this.http.post<BlogDto>(this.apiBaseUrl, blog);
  }

  updateBlog(id: string, blog: BlogRequestDto): Observable<BlogDto> {
    return this.http.put<BlogDto>(`${this.apiBaseUrl}/${id}`, blog);
  }

  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`);
  }

  private getPagedBlogs(
    endpoint: string,
    pageNumber: number,
    pageSize: number,
  ): Observable<BlogPageResult> {
    const skipCount = (pageNumber - 1) * pageSize;

    const params = new HttpParams()
      .set('skipCount', skipCount.toString())
      .set('maxResultCount', pageSize.toString());

    return this.http
      .get<PagedResultDto<BlogDto>>(endpoint, { params })
      .pipe(map((response) => this.normalizePagedResult(response)));
  }

  private normalizePagedResult(response: PagedResultDto<BlogDto>): BlogPageResult {
    const items = Array.isArray(response?.items) ? response.items : [];

    return {
      items,
      totalCount: response?.totalCount ?? 0,
      skipCount: response?.skipCount ?? 0,
      maxResultCount: response?.maxResultCount ?? items.length,
    };
  }
}
