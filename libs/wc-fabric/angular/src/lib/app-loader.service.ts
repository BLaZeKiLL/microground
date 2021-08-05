import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { loadBundle, loadStyle } from "@codeblaze/wc-fabric-core";
import { WcAppConfig, WcBundleInfo } from "./wc-fabric.model";

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

  constructor(
    private http: HttpClient
  ) {}

  public async loadApp(app: WcAppConfig): Promise<void> {
    const info = await this.http.get<WcBundleInfo>(`${app.url}/bundle.json`).toPromise();

    info.bundles.main.forEach(async (bundle) => {
      await loadBundle(`${app.url}/${bundle}`, app.cache);
    });

    if (app.styles !== undefined && app.styles) {
      info.styles.forEach(async (style) => {
        await loadStyle(`${app.url}/${style}`, app.cache);
      });
    }

    if (app.runtime !== undefined && app.runtime) {
      info.bundles.scripts.forEach(async (script) => {
        await loadBundle(`${app.url}/${script}`, app.cache);
      });
    }

    if (app.polyfills !== undefined && app.polyfills) {
      info.bundles.polyfills.forEach(async (polyfill) => {
        await loadBundle(`${app.url}/${polyfill}`, app.cache);
      });
    }

    console.log(`[WC-FABRIC] ${info.name} loaded`);
  }

}
