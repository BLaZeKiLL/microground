export interface WcFabricConfig {
  apps: WcAppConfig[];
}

export interface WcAppConfig {
  url: string,
  cache?: boolean,
  styles?: boolean,
  runtime?: boolean,
  polyfills?: boolean
}

export interface WcBundleInfo {
  name: string,
  bundles: {
    main: string[],
    scripts: string[],
    polyfills: string[]
  },
  styles: string[],
  maps: string[]
}
