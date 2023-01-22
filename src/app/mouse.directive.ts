import { Directive,HostListener } from '@angular/core';

@Directive({
  selector: '[appMouse]'
})
export class MouseDirective {

  constructor() { 
    console.log("hi I ma")
  }
  @HostListener('mouseover',['$event'])
  onMouseOver(event:any){
    console.log("event in directive")
  }

}
