import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appFallbackImage]'
})
export class FallbackImageDirective {
  @Input() fallback: string = 'assets/images/no-image.png';
  
  constructor(private el: ElementRef) {}

  @HostListener('error')
  onError() {
    const img = this.el.nativeElement;
    img.src = this.fallback;
  }
}
