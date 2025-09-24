import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdvancedAgentChatComponent } from './components/advanced-agent-chat/advanced-agent-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdvancedAgentChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}