import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title when logged in', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    vi.spyOn(fixture.componentInstance, 'isLoggedIn').mockReturnValue(true);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span.text-2xl')?.textContent).toContain('Autókölcsönző');
  });
});
