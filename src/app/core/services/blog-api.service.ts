import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { appConfiguration } from '../config/app-config';
import { BlogDto, BlogPageResult, BlogRequestDto, PagedResultDto } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogApiService {
  private readonly blogsEndpoint = new URL(
    appConfiguration.apiPaths.blogs,
    appConfiguration.apiBaseUrl,
  ).toString();
  private readonly myBlogsEndpoint = new URL(
    appConfiguration.apiPaths.myBlogs,
    appConfiguration.apiBaseUrl,
  ).toString();

  constructor(private readonly http: HttpClient) {}

  getPublicBlogs(pageNumber: number, pageSize: number): Observable<BlogPageResult> {
    return this.getPagedBlogs(this.blogsEndpoint, pageNumber, pageSize);
  }

  getMyBlogs(pageNumber: number, pageSize: number): Observable<BlogPageResult> {
    return this.getPagedBlogs(this.myBlogsEndpoint, pageNumber, pageSize);
  }

  createBlog(blog: BlogRequestDto): Observable<BlogDto> {
    return this.http.post<BlogDto>(this.blogsEndpoint, blog);
  }

  updateBlog(id: string, blog: BlogRequestDto): Observable<BlogDto> {
    return this.http.put<BlogDto>(this.blogUrl(id), blog);
  }

  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(this.blogUrl(id));
  }

  private blogUrl(id: string): string {
    const endpoint = this.blogsEndpoint.endsWith('/')
      ? this.blogsEndpoint
      : `${this.blogsEndpoint}/`;

    return new URL(encodeURIComponent(id), endpoint).toString();
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
