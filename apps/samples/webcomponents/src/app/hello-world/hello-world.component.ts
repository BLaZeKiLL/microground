import { Component, Input } from '@angular/core';

@Component({
  selector: 'microground-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.scss']
})
export class HelloWorldComponent {

  @Input() message : string;

}
