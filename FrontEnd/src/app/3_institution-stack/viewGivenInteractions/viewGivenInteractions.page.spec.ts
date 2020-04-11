import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../0_explore-container/explore-container.module';
import { ViewGivenInteractionsPage } from './viewGivenInteractions.page';

describe('ViewGivenInteractionsPage', () => {
  let component: ViewGivenInteractionsPage;
  let fixture: ComponentFixture<ViewGivenInteractionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewGivenInteractionsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewGivenInteractionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
