export class SuccessResDTO {
  data: any;
  statusCode!: number;

  constructor(partial: Partial<SuccessResDTO>) {
    Object.assign(this, partial);
  }
}

export class ErrorResDTO {
  message: string;
  statusCode: number;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
