import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeCellEditor } from './date-time-cell-editor.component';

describe('DateTimeCellEditorComponent', () => {
  let component: DateTimeCellEditor;
  let fixture: ComponentFixture<DateTimeCellEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimeCellEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateTimeCellEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
