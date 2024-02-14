import {Inject, Injectable, InjectionToken, Optional, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import { Request, Response } from 'express';
import {HttpClient} from "@angular/common/http";
import {REQUEST} from "../../../express.tokens";

export type SameSite = 'Lax' | 'None' | 'Strict';

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: SameSite;
}


@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly isBrowser: boolean;

  constructor(
    @Optional() @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    @Optional() @Inject(REQUEST) private request: Request,
    protected http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private static getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');
    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
  }

  private static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      // probably it is not uri encoded. return as is
      return encodedURIComponent;
    }
  }

  public check(name: string): boolean {
    name = encodeURIComponent(name);
    const regExp: RegExp = CookieService.getCookieRegExp(name);
    return regExp.test(this.isBrowser ? this.document.cookie : this.request?.headers.cookie);
  }

  public get(name: string): string {
    if (this.check(name)) {
      name = encodeURIComponent(name);

      const regExp: RegExp = CookieService.getCookieRegExp(name);
      const result: RegExpExecArray = regExp.exec(this.isBrowser ? this.document.cookie : this.request?.headers.cookie);

      return result[1] ? CookieService.safeDecodeURIComponent(result[1]) : '';
    } else {
      return '';
    }
  }

  getAll(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    const cookieString: any = this.isBrowser ? this.document?.cookie : this.request?.headers.cookie;

    if (cookieString && cookieString !== '') {
      cookieString.split(';').forEach((currentCookie:string) => {
        const [cookieName, cookieValue] = currentCookie.split('=');
        cookies[CookieService.safeDecodeURIComponent(cookieName.replace(/^ /, ''))] = CookieService.safeDecodeURIComponent(cookieValue);
      });
    }

    return cookies;
  }

  set(name: string, value: string, expires?: number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: 'Lax' | 'None' | 'Strict'): void;
  set(
    name: string,
    value: string,
    options?: {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Lax' | 'None' | 'Strict';
    }
  ): void;

  set(
    name: string,
    value: string,
    expiresOrOptions?: number | Date | any,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: 'Lax' | 'None' | 'Strict'
  ): void {
    if (!this.isBrowser) {
      return;
    }

    if (typeof expiresOrOptions === 'number' || expiresOrOptions instanceof Date || path || domain || secure || sameSite) {
      const optionsBody = {
        expires: expiresOrOptions,
        path,
        domain,
        secure,
        sameSite: sameSite ? sameSite : 'Lax',
      };

      this.set(name, value, optionsBody);
      return;
    }

    let cookieString: string = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';

    const options = expiresOrOptions ? expiresOrOptions : {};

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const dateExpires: Date = new Date(new Date().getTime() + options.expires * 1000 * 60 * 60 * 24);

        cookieString += 'expires=' + dateExpires.toUTCString() + ';';
      } else {
        cookieString += 'expires=' + options.expires.toUTCString() + ';';
      }
    }

    if (options.path) {
      cookieString += 'path=' + options.path + ';';
    }

    if (options.domain) {
      cookieString += 'domain=' + options.domain + ';';
    }

    if (options.secure === false && options.sameSite === 'None') {
      options.secure = true;
      console.warn(
        `[cookie-service] Cookie ${name} was forced with secure flag because sameSite=None.` +
        `More details : https://github.com/stevermeister/ngx-cookie-service/issues/86#issuecomment-597720130`
      );
    }
    if (options.secure) {
      cookieString += 'secure;';
    }

    if (!options.sameSite) {
      options.sameSite = 'Lax';
    }

    cookieString += 'sameSite=' + options.sameSite + ';';

    this.document.cookie = cookieString;
  }

  delete(name: string, path?: string, domain?: string, secure?: boolean, sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'): void {
    if (!this.isBrowser) {
      return;
    }
    const expiresDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
    this.set(name, '', { expires: expiresDate, path, domain, secure, sameSite });
  }

  deleteAll(path?: string, domain?: string, secure?: boolean, sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'): void {
    if (!this.isBrowser) {
      return;
    }

    const cookies: any = this.getAll();

    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain, secure, sameSite);
      }
    }
  }
}
