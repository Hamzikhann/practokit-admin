import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBlockCutCopy]'
})
export class BlockCutCopyDirective {

  constructor() { }

  
  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

}
