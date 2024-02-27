import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainsComponent } from './remains.component';

describe('RemainsComponent', () => {
  let component: RemainsComponent;
  let fixture: ComponentFixture<RemainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemainsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
