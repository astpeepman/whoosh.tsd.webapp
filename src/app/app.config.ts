import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import {provideClientHydration, withHttpTransferCacheOptions} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import {credentialsInterceptor} from "./interceptors/credential.interceptor";
import { provideServiceWorker } from '@angular/service-worker';
import {serverAuthInterceptor} from "./interceptors/server.auth.interceptor";
import {authInterceptor} from "./interceptors/auth.interceptor";
import {errorInterceptor} from "./interceptors/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true
      })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([
        credentialsInterceptor,
        serverAuthInterceptor,
        authInterceptor,
        errorInterceptor
      ])
    ),
    importProvidersFrom(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
