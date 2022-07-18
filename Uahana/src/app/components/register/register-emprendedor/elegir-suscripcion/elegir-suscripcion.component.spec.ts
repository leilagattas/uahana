import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirSuscripcionComponent } from './elegir-suscripcion.component';

describe('ElegirSuscripcionComponent', () => {
  let component: ElegirSuscripcionComponent;
  let fixture: ComponentFixture<ElegirSuscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElegirSuscripcionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElegirSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
