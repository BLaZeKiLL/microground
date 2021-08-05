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
    const info = await this.http.get<WcBundleInfo>(`${app.url}/bundle.json?time=${Date.now()}`).toPromise();

    await Promise.all(info.bundles.main.map(async (bundle) => {
      await loadBundle(`${app.url}/${bundle}`, app.cache);
    }));

    if (app.styles !== undefined && app.styles) {
      await Promise.all(info.styles.map(async (style) => {
        await loadStyle(`${app.url}/${style}`, app.cache);
      }));
    }

    if (app.runtime !== undefined && app.runtime) {
      await Promise.all(info.bundles.scripts.map(async (script) => {
        await loadBundle(`${app.url}/${script}`, app.cache);
      }));
    }

    if (app.polyfills !== undefined && app.polyfills) {
      await Promise.all(info.bundles.polyfills.map(async (polyfill) => {
        await loadBundle(`${app.url}/${polyfill}`, app.cache);
      }));
    }

    console.log(`[WC-FABRIC] ${info.name} loaded`);
  }

}
