import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
}

@Component({
  selector: 'app-blog-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-generator.component.html',
  styleUrl: './blog-generator.component.css'
})
export class BlogGeneratorComponent implements OnInit {
  topic: string = '';
  statusMessage: string = '';
  statusType: 'info' | 'success' | 'error' = 'info';
  generateButtonDisabled: boolean = false;
  blogPosts: BlogPost[] = [];

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.fetchPosts();
  }

  showStatus(message: string, type: 'info' | 'success' | 'error' = 'info') {
    this.statusMessage = message;
    this.statusType = type;
  }

  async fetchPosts() {
    this.blogService.getBlogPosts().subscribe({
      next: (posts) => {
        this.blogPosts = posts;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.showStatus('Failed to load blog posts.', 'error');
      }
    });
  }

  async generatePost() {
    this.statusMessage = '';
    if (!this.topic.trim()) {
      this.showStatus('Please enter a topic.', 'error');
      return;
    }

    this.generateButtonDisabled = true;
    this.showStatus('Generating blog post... this may take a moment.', 'info');

    this.blogService.generateBlogPost(this.topic).subscribe({
      next: (newPost) => {
        this.showStatus('Post generated successfully!', 'success');
        this.topic = '';
        this.fetchPosts();
      },
      error: (err) => {
        console.error('Error generating blog post:', err);
        this.showStatus(`Error: ${err.error?.error || 'An unexpected error occurred.'}`, 'error');
      },
      complete: () => {
        this.generateButtonDisabled = false;
      }
    });
  }
}
