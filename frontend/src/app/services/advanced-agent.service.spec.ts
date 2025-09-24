import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdvancedAgentService } from './advanced-agent.service';

describe('AdvancedAgentService', () => {
  let service: AdvancedAgentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdvancedAgentService]
    });
    service = TestBed.inject(AdvancedAgentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should process an advanced prompt via POST request', () => {
    const mockPrompt = 'Hello advanced agent';
    const mockSessionId = 'test-session-123';
    const mockResponse = { output: 'Advanced agent reply', intermediateSteps: [], memoryState: {} };

    service.processAdvancedPrompt(mockPrompt, mockSessionId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/advanced-agent-chat');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ prompt: mockPrompt, sessionId: mockSessionId });

    req.flush(mockResponse);
  });

  it('should handle API errors', () => {
    const mockPrompt = 'Error test';
    const mockSessionId = 'test-session-123';
    const mockError = { status: 500, statusText: 'Internal Server Error' };
    const mockErrorMessage = { error: 'An error occurred.' };

    service.processAdvancedPrompt(mockPrompt, mockSessionId).subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error) => {
        expect(error.status).toEqual(500);
        expect(error.error).toEqual(mockErrorMessage);
      }
    });

    const req = httpTestingController.expectOne('/api/advanced-agent-chat');
    req.flush(mockErrorMessage, mockError);
  });
});
