import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostcodeFillAutoComponent } from './postcode-fill-auto.component';

describe('PostcodeFillAutoComponent', () => {
  let component: PostcodeFillAutoComponent;
  let fixture: ComponentFixture<PostcodeFillAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostcodeFillAutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostcodeFillAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
