import { BrowserModule } from '@angular/platform-browser';
import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { HelloWorldComponent } from './hello-world/hello-world.component';

@NgModule({
  declarations: [
    HelloWorldComponent
  ],
  imports: [
    BrowserModule
  ]
})
export class WebComponentsModule implements DoBootstrap {

  constructor(private injector : Injector) {}

  ngDoBootstrap(): void {
    customElements.define('wc-hello-world', createCustomElement(HelloWorldComponent, {injector: this.injector}));
  }

}
