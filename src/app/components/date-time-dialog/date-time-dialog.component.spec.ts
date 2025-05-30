import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeDialogComponent } from './date-time-dialog.component';

describe('DateTimeDialogComponent', () => {
  let component: DateTimeDialogComponent;
  let fixture: ComponentFixture<DateTimeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateTimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
