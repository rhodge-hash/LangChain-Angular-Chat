import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdvancedAgentChatComponent } from './components/advanced-agent-chat/advanced-agent-chat.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdvancedAgentChatComponent, MatToolbarModule, MatSidenavModule, MatListModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}