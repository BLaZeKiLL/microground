import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { loadBundle } from '@codeblaze/wc-fabric-core';
import { WcFabricConfig } from './wc-fabric.config';

// @dynamic
@NgModule()
export class WcFabricModule {

  public static forRoot(config: WcFabricConfig) : ModuleWithProviders<WcFabricModule> {
    return {
      ngModule: WcFabricModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: async () => {
            config.bundles.forEach(
              async (bundle) => await loadBundle(bundle.url, bundle.cache)
            );
            console.info(`[WC-FABRIC] ${config.bundles.length} bundles loaded`);
          }
        }
      ]
    };
  }

}
