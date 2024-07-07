import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WordService } from './word.service';

fdescribe('WordService', () => {
  let service: WordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WordService]
    });
    service = TestBed.inject(WordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true for a valid word', () => {
    const mockResponse = [{ word: 'hello', meaning: '...' }]; // Example of a valid response

    service.checkWord('hello').subscribe(isValid => {
      expect(isValid).toBe(true);
    });

    const req = httpMock.expectOne('https://api.dictionaryapi.dev/api/v2/entries/en/hello');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return false for an invalid word', () => {
    const mockErrorResponse = { title: 'No Definitions Found' };

    service.checkWord('invalidword').subscribe(isValid => {
      expect(isValid).toBe(false);
    });

    const req = httpMock.expectOne('https://api.dictionaryapi.dev/api/v2/entries/en/invalidword');
    expect(req.request.method).toBe('GET');
    req.flush(mockErrorResponse);
  });

  it('should return false if there is an error', () => {
    service.checkWord('errorword').subscribe(isValid => {
      expect(isValid).toBe(false);
    });

    const req = httpMock.expectOne('https://api.dictionaryapi.dev/api/v2/entries/en/errorword');
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));
  });
});
