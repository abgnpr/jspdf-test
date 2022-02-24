import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JspdfPlaygroundComponent } from './jspdf-playground.component';

describe('JspdfPlaygroundComponent', () => {
  let component: JspdfPlaygroundComponent;
  let fixture: ComponentFixture<JspdfPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JspdfPlaygroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JspdfPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
