import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BookFormComponent } from './book-form.component';
import { BookService } from '../../../../shared/services/book/book.service';
import { AuthorService } from '../../../../shared/services/author/author.service';
import { of } from 'rxjs';

describe('BookFormComponent', () => {
  let component: BookFormComponent;
  let fixture: ComponentFixture<BookFormComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let authorService: jasmine.SpyObj<AuthorService>;

  const mockBook = {
    id: '1',
    title: 'Test Book',
    description: 'Test Description',
    year: 2023,
    authorId: '1',
  };

  const mockAuthors = [
    {
      id: '1',
      name: 'Author 1',
      gender: 'M',
      biography: 'Bio 1',
      birthDate: '1990-01-01',
    },
    {
      id: '2',
      name: 'Author 2',
      gender: 'F',
      biography: 'Bio 2',
      birthDate: '1985-01-01',
    },
  ];

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', [
      'createBook',
      'updateBook',
    ]);
    const authorServiceSpy = jasmine.createSpyObj('AuthorService', [
      'getAuthors',
    ]);

    await TestBed.configureTestingModule({
      declarations: [BookFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: BookService, useValue: bookServiceSpy },
        { provide: AuthorService, useValue: authorServiceSpy },
      ],
    }).compileComponents();

    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    authorService = TestBed.inject(
      AuthorService
    ) as jasmine.SpyObj<AuthorService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookFormComponent);
    component = fixture.componentInstance;
    authorService.getAuthors.and.returnValue(of(mockAuthors));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.bookForm.get('title')?.value).toBe('');
    expect(component.bookForm.get('description')?.value).toBe('');
    expect(component.bookForm.get('year')?.value).toBe('');
    expect(component.bookForm.get('authorId')?.value).toBe('');
  });

  it('should load authors on init', () => {
    expect(authorService.getAuthors).toHaveBeenCalled();
    expect(component.authors).toEqual(mockAuthors);
  });

  it('should populate form when book is provided for editing', () => {
    component.book = mockBook;
    component.ngOnInit();

    expect(component.bookForm.get('title')?.value).toBe(mockBook.title);
    expect(component.bookForm.get('description')?.value).toBe(
      mockBook.description
    );
    expect(component.bookForm.get('year')?.value).toBe(mockBook.year);
    expect(component.bookForm.get('authorId')?.value).toBe(mockBook.authorId);
  });

  it('should validate required fields', () => {
    const form = component.bookForm;
    expect(form.valid).toBeFalsy();

    form.controls.title.setValue('Test Book');
    form.controls.description.setValue('Test Description');
    form.controls.year.setValue(2023);
    form.controls.authorId.setValue('1');

    expect(form.valid).toBeTruthy();
  });

  it('should validate year range', () => {
    const yearControl = component.bookForm.get('year');

    yearControl?.setValue(1899);
    expect(yearControl?.errors?.['min']).toBeTruthy();

    yearControl?.setValue(2025);
    expect(yearControl?.errors?.['max']).toBeTruthy();

    yearControl?.setValue(2023);
    expect(yearControl?.errors).toBeNull();
  });

  it('should emit save event with form value when valid', () => {
    spyOn(component.save, 'emit');

    component.bookForm.setValue({
      title: 'Test Book',
      description: 'Test Description',
      year: 2023,
      authorId: '1',
    });

    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith({
      title: 'Test Book',
      description: 'Test Description',
      year: 2023,
      authorId: '1',
    });
  });

  it('should not emit save event when form is invalid', () => {
    spyOn(component.save, 'emit');

    component.bookForm.setValue({
      title: '',
      description: '',
      year: null,
      authorId: '',
    });

    component.onSubmit();

    expect(component.save.emit).not.toHaveBeenCalled();
  });
});
