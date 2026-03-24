import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Milestones } from './milestones';

describe('Milestones', () => {
  let component: Milestones;
  let fixture: ComponentFixture<Milestones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Milestones],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Milestones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
