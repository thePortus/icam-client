import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSpecsComponent } from './home-specs.component';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { SafeResourceUrl } from '@angular/platform-browser';
import { ɵunwrapSafeValue } from '@angular/core';

describe('HomeSpecsComponent', () => {
  let component: HomeSpecsComponent;
  let fixture: ComponentFixture<HomeSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSpecsComponent ],
      imports: [
        MatCardModule,
        MatListModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a well-formed specs file', () => {
    expect(component.specs).toBeInstanceOf(Object);
    expect(component.specs.specs[0].link).toBeInstanceOf(String);
    expect(component.specs.specs[0].label).toBeInstanceOf(String);
    expect(component.specs.specs[0].value).toBeInstanceOf(String);
    expect(component.specs.repositories[0].link).toBeInstanceOf(String);
    expect(component.specs.repositories[0].label).toBeInstanceOf(String);
    expect(component.specs.repositories[0].value).toBeInstanceOf(String);
    expect(component.specs.dependencies.frontend[0].link).toBeInstanceOf(String);
    expect(component.specs.dependencies.frontend[0].label).toBeInstanceOf(String);
    expect(component.specs.dependencies.backend[0].link).toBeInstanceOf(String);
    expect(component.specs.dependencies.backend[0].label).toBeInstanceOf(String);
    expect(component.specs.dependencies.developer[0].link).toBeInstanceOf(String);
    expect(component.specs.dependencies.developer[0].label).toBeInstanceOf(String);
    expect(component.specs.erd).toBeInstanceOf(String);
  });

  it('.safeUrl should return a sanitized URL', () => {
    expect(component.safeUrl('https://example.org')).toBeInstanceOf(Object);
  });
});
