import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthorFormComponent } from './author-form.component';
import { AuthorService } from '../../../../shared/services/author/author.service';
import { of } from 'rxjs';

describe('AuthorFormComponent', () => {
  let component: AuthorFormComponent;
  let fixture: ComponentFixture<AuthorFormComponent>;
  let authorService: jasmine.SpyObj<AuthorService>;

  const mockAuthor = {
    id: '1',
    name: 'Test Author',
    biography: 'Test Biography',
    birthDate: '1990-01-01',
    gender: 'M',
  };

  beforeEach(async () => {
    const authorServiceSpy = jasmine.createSpyObj('AuthorService', [
      'createAuthor',
      'updateAuthor',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AuthorFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthorService, useValue: authorServiceSpy },
      ],
    }).compileComponents();

    authorService = TestBed.inject(
      AuthorService
    ) as jasmine.SpyObj<AuthorService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.authorForm.get('name')?.value).toBe('');
    expect(component.authorForm.get('biography')?.value).toBe('');
    expect(component.authorForm.get('birthDate')?.value).toBe('');
    expect(component.authorForm.get('gender')?.value).toBe('');
  });

  it('should populate form when author is provided for editing', () => {
    component.author = mockAuthor;
    component.ngOnInit();

    expect(component.authorForm.get('name')?.value).toBe(mockAuthor.name);
    expect(component.authorForm.get('biography')?.value).toBe(
      mockAuthor.biography
    );
    expect(component.authorForm.get('birthDate')?.value).toBe(
      mockAuthor.birthDate
    );
    expect(component.authorForm.get('gender')?.value).toBe(mockAuthor.gender);
  });

  it('should validate required fields', () => {
    const form = component.authorForm;
    expect(form.valid).toBeFalsy();

    form.controls.name.setValue('Test Author');
    form.controls.biography.setValue('Test Biography');
    form.controls.birthDate.setValue('1990-01-01');
    form.controls.gender.setValue('M');

    expect(form.valid).toBeTruthy();
  });

  it('should validate name length', () => {
    const nameControl = component.authorForm.get('name');

    nameControl?.setValue('a'); // Too short
    expect(nameControl?.errors?.['minlength']).toBeTruthy();

    nameControl?.setValue('a'.repeat(101)); // Too long
    expect(nameControl?.errors?.['maxlength']).toBeTruthy();

    nameControl?.setValue('Valid Name');
    expect(nameControl?.errors).toBeNull();
  });

  it('should validate birth date is not in the future', () => {
    const birthDateControl = component.authorForm.get('birthDate');
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    birthDateControl?.setValue(futureDate.toISOString().split('T')[0]);
    expect(birthDateControl?.errors?.['futureDate']).toBeTruthy();

    birthDateControl?.setValue('1990-01-01');
    expect(birthDateControl?.errors).toBeNull();
  });

  it('should emit save event with form value when valid', () => {
    spyOn(component.save, 'emit');

    component.authorForm.setValue({
      name: 'Test Author',
      biography: 'Test Biography',
      birthDate: '1990-01-01',
      gender: 'M',
    });

    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith({
      name: 'Test Author',
      biography: 'Test Biography',
      birthDate: '1990-01-01',
      gender: 'M',
    });
  });

  it('should not emit save event when form is invalid', () => {
    spyOn(component.save, 'emit');

    component.authorForm.setValue({
      name: '',
      biography: '',
      birthDate: '',
      gender: '',
    });

    component.onSubmit();

    expect(component.save.emit).not.toHaveBeenCalled();
  });

  it('should emit cancel event when onCancel is called', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
