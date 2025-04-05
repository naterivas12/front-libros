import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective implements OnInit {
  @Input('appDateFormat') format: string = 'dd/MM/yyyy';
  
  constructor(private el: ElementRef) {}

  ngOnInit() {
    const date = new Date(this.el.nativeElement.textContent);
    if (!isNaN(date.getTime())) {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      };
      this.el.nativeElement.textContent = date.toLocaleDateString('es-ES', options);
    }
  }
}
