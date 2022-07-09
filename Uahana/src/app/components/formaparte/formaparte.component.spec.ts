import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaparteComponent } from './formaparte.component';

describe('FormaparteComponent', () => {
  let component: FormaparteComponent;
  let fixture: ComponentFixture<FormaparteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormaparteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormaparteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
