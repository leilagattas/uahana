import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarTrabajoComponent } from './cargar-trabajo.component';

describe('CargarTrabajoComponent', () => {
  let component: CargarTrabajoComponent;
  let fixture: ComponentFixture<CargarTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargarTrabajoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
