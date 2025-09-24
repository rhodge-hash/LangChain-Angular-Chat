import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AgentService } from './agent.service';

describe('AgentService', () => {
  let service: AgentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AgentService]
    });
    service = TestBed.inject(AgentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should process a prompt via POST request', () => {
    const mockPrompt = 'Hello';
    const mockResponse = { response: 'Hi there!' };

    service.processPrompt(mockPrompt).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/process-prompt');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ prompt: mockPrompt });

    req.flush(mockResponse);
  });

  it('should handle API errors', () => {
    const mockPrompt = 'Error test';
    const mockError = { status: 500, statusText: 'Internal Server Error' };
    const mockErrorMessage = { error: 'An error occurred.' };

    service.processPrompt(mockPrompt).subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error) => {
        expect(error.status).toEqual(500);
        expect(error.error).toEqual(mockErrorMessage);
      }
    });

    const req = httpTestingController.expectOne('/api/process-prompt');
    req.flush(mockErrorMessage, mockError);
  });
});
