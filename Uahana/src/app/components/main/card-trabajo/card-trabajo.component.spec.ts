import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTrabajoComponent } from './card-trabajo.component';

describe('CardTrabajoComponent', () => {
  let component: CardTrabajoComponent;
  let fixture: ComponentFixture<CardTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardTrabajoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
