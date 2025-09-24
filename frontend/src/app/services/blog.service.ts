import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
}

interface GeneratePostRequest {
  topic: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private generatePostUrl = '/api/generate-blog-post';
  private getPostsUrl = '/api/blog-posts';

  constructor(private http: HttpClient) { }

  generateBlogPost(topic: string): Observable<BlogPost> {
    return this.http.post<BlogPost>(this.generatePostUrl, { topic });
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.getPostsUrl);
  }
}
