import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProfessor } from './home-professor';

describe('HomeProfessor', () => {
  let component: HomeProfessor;
  let fixture: ComponentFixture<HomeProfessor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProfessor],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeProfessor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});