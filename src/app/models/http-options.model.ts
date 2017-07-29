import { Headers, RequestOptions } from '@angular/http';

export class HttpOptions extends RequestOptions {

  constructor(uid: string) {
    super();
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'uid': uid
    });
  }
}