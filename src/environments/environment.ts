// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  reqBaseUrl: 'http://localhost:8000/api/v1/',
  imgBaseUrl: 'http://localhost:8000/',
  socketUrl: 'http://localhost:8000/',
  uploadFileSize: 5000000,
  dropBoxToken:
    '4dLVexvzQZMAAAAAAAAAAb6AR3E0ttNIGn2xwztblEROwtviNgK2k8S-ZXzc7gsx',
  dropBoxFolder: 'apps/assessmentTool/',
  fileSource: 'dropbox',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
