export interface BlogRequestDto {
  title: string;
  content: string;
}

export interface BlogDto {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
}

export interface PagedResultDto<T> {
  items?: T[];
  totalCount?: number;
  skipCount?: number;
  maxResultCount?: number;
}

export interface BlogPageResult {
  items: BlogDto[];
  totalCount: number;
  skipCount: number;
  maxResultCount: number;
}
