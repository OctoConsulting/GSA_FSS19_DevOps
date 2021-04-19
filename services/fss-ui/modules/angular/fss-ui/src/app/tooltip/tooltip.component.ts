import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html'
})
export class TooltipComponent implements OnInit {

 
  // deconstruct your components here
  @Input() text = '';

  @Input() type = 'top';

  constructor() { }

  ngOnInit() {
    

  }

}
