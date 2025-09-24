import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogGeneratorComponent } from './components/blog-generator/blog-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BlogGeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
