import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdoBusquedaComponent } from './rdo-busqueda.component';

describe('RdoBusquedaComponent', () => {
  let component: RdoBusquedaComponent;
  let fixture: ComponentFixture<RdoBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdoBusquedaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdoBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
