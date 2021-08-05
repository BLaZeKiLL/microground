import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { WcFabricConfig } from './wc-fabric.model';
import { AppLoaderService } from './app-loader.service';

// @dynamic
@NgModule()
export class WcFabricModule {

  public static forRoot(config: WcFabricConfig) : ModuleWithProviders<WcFabricModule> {
    return {
      ngModule: WcFabricModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: async (loader: AppLoaderService) => {
            config.apps.forEach(async (app) => await loader.loadApp(app));
          }
        }
      ]
    };
  }

}
