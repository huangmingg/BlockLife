import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OwnerStackPage } from './owner-stack.page';

describe('OwnerStackPage', () => {
  let component: OwnerStackPage;
  let fixture: ComponentFixture<OwnerStackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerStackPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerStackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
