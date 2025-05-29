import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarGridComponent } from './car-grid.component';

describe('CarGridComponent', () => {
  let component: CarGridComponent;
  let fixture: ComponentFixture<CarGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
