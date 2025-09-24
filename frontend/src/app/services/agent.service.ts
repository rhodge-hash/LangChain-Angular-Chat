import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AgentResponse {
  response: string;
}

interface AgentRequest {
  prompt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = '/api/process-prompt'; // Proxy will handle routing to backend

  constructor(private http: HttpClient) { }

  processPrompt(prompt: string): Observable<AgentResponse> {
    return this.http.post<AgentResponse>(this.apiUrl, { prompt });
  }
}
