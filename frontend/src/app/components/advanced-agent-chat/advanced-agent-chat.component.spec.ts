import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedAgentChatComponent } from './advanced-agent-chat.component';
import { AdvancedAgentService } from '../../services/advanced-agent.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('AdvancedAgentChatComponent', () => {
  let component: AdvancedAgentChatComponent;
  let fixture: ComponentFixture<AdvancedAgentChatComponent>;
  let advancedAgentServiceSpy: jasmine.SpyObj<AdvancedAgentService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdvancedAgentService', ['processAdvancedPrompt']);

    await TestBed.configureTestingModule({
      imports: [AdvancedAgentChatComponent, CommonModule, FormsModule], // Import standalone component and its dependencies
      providers: [
        { provide: AdvancedAgentService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedAgentChatComponent);
    component = fixture.componentInstance;
    advancedAgentServiceSpy = TestBed.inject(AdvancedAgentService) as jasmine.SpyObj<AdvancedAgentService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error message if prompt is empty', () => {
    component.prompt = '';
    component.onSubmit();
    expect(component.errorMessage).toBe('Prompt cannot be empty.');
    expect(advancedAgentServiceSpy.processAdvancedPrompt.calls.any()).toBe(false);
  });

  it('should call advancedAgentService.processAdvancedPrompt and display response', () => {
    const mockResponse = { output: 'Advanced Agent's reply', intermediateSteps: [], memoryState: {} };
    advancedAgentServiceSpy.processAdvancedPrompt.and.returnValue(of(mockResponse));

    component.prompt = 'Test prompt';
    component.sessionId = 'test-session-id';
    component.onSubmit();

    expect(component.isLoading).toBe(true);
    expect(advancedAgentServiceSpy.processAdvancedPrompt.calls.any()).toBe(true);

    fixture.detectChanges();
    expect(component.response).toBe(mockResponse.output);
    expect(component.isLoading).toBe(false);
  });

  it('should display an error message on API error', () => {
    const errorMessage = 'API failed';
    advancedAgentServiceSpy.processAdvancedPrompt.and.returnValue(throwError(() => ({ error: { error: errorMessage } })));

    component.prompt = 'Test prompt';
    component.sessionId = 'test-session-id';
    component.onSubmit();

    expect(component.isLoading).toBe(true);
    expect(advancedAgentServiceSpy.processAdvancedPrompt.calls.any()).toBe(true);

    fixture.detectChanges();
    expect(component.errorMessage).toBe(errorMessage);
    expect(component.isLoading).toBe(false);
  });

  it('should generate a new session ID on init', () => {
    expect(component.sessionId).toBeDefined();
    expect(component.sessionId.length).toBeGreaterThan(0);
  });

  it('should generate a new session ID when generateNewSessionId is called', () => {
    const oldSessionId = component.sessionId;
    component.generateNewSessionId();
    expect(component.sessionId).not.toBe(oldSessionId);
    expect(component.response).toBe('');
    expect(component.errorMessage).toBe('');
    expect(component.intermediateSteps.length).toBe(0);
    expect(component.prompt).toBe('');
  });
});
