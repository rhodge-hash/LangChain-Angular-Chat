import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdvancedAgentChatComponent } from './components/advanced-agent-chat/advanced-agent-chat.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { AuthService } from './services/auth.service'; // Import AuthService
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule
    RouterOutlet,
    AdvancedAgentChatComponent,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule // Add MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private authService: AuthService) {} // Inject AuthService

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}