import { HostListener } from '@angular/core';
import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[appPhoneNo]'
})
export class PhoneNoDirective {

  constructor(public ngControl: NgControl) { }
  @HostListener("input", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    console.log('appPhoneNo directive')
    const input = event.target as HTMLInputElement;

    let trimmed = input.value.replace(/\D+/g, "");

    if (trimmed.length > 12) {
      trimmed = trimmed.substr(0, 12);
    }

    trimmed = trimmed.replace(/-/g, "");

    let numbers = [];

    numbers.push(trimmed.substr(0, 4));
    if (trimmed.substr(4, 7) !== "") numbers.push(trimmed.substr(4, 7));

    input.value = numbers.join("-");
  }
}
