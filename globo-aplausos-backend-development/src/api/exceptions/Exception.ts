import { HttpStatus, HttpException } from '@nestjs/common';

export class Exception extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
