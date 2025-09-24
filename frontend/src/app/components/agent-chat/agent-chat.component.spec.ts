import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentChatComponent } from './agent-chat.component';
import { AgentService } from '../../services/agent.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('AgentChatComponent', () => {
  let component: AgentChatComponent;
  let fixture: ComponentFixture<AgentChatComponent>;
  let agentServiceSpy: jasmine.SpyObj<AgentService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AgentService', ['processPrompt']);

    await TestBed.configureTestingModule({
      imports: [AgentChatComponent, CommonModule, FormsModule], // Import standalone component and its dependencies
      providers: [
        { provide: AgentService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentChatComponent);
    component = fixture.componentInstance;
    agentServiceSpy = TestBed.inject(AgentService) as jasmine.SpyObj<AgentService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error message if prompt is empty', () => {
    component.prompt = '';
    component.onSubmit();
    expect(component.errorMessage).toBe('Prompt cannot be empty.');
    expect(agentServiceSpy.processPrompt.calls.any()).toBe(false);
  });

  it('should call agentService.processPrompt and display response', () => {
    const mockResponse = { response: 'Agent's reply' };
    agentServiceSpy.processPrompt.and.returnValue(of(mockResponse));

    component.prompt = 'Test prompt';
    component.onSubmit();

    expect(component.isLoading).toBe(true);
    expect(agentServiceSpy.processPrompt.calls.any()).toBe(true);

    fixture.detectChanges();
    expect(component.response).toBe(mockResponse.response);
    expect(component.isLoading).toBe(false);
  });

  it('should display an error message on API error', () => {
    const errorMessage = 'API failed';
    agentServiceSpy.processPrompt.and.returnValue(throwError(() => ({ error: { error: errorMessage } })));

    component.prompt = 'Test prompt';
    component.onSubmit();

    expect(component.isLoading).toBe(true);
    expect(agentServiceSpy.processPrompt.calls.any()).toBe(true);

    fixture.detectChanges();
    expect(component.errorMessage).toBe(errorMessage);
    expect(component.isLoading).toBe(false);
  });
});
