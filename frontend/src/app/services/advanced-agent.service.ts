import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AdvancedAgentResponse {
  output: string;
  intermediateSteps?: any[];
  memoryState?: any;
}

interface AdvancedAgentRequest {
  prompt: string;
  sessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedAgentService {
  private apiUrl = '/api/advanced-agent-chat'; // Proxy will handle routing to backend

  constructor(private http: HttpClient) { }

  processAdvancedPrompt(prompt: string, sessionId: string): Observable<AdvancedAgentResponse> {
    return this.http.post<AdvancedAgentResponse>(this.apiUrl, { prompt, sessionId });
  }
}
