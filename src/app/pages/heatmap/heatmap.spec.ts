import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Heatmap } from './heatmap';

describe('Heatmap', () => {
  let component: Heatmap;
  let fixture: ComponentFixture<Heatmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Heatmap],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Heatmap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
