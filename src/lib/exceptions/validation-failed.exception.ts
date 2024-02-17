import { ObjectType } from '@nestjs/graphql';
import { ErrorResult } from '../grpahql/objects/error-result';

export class ValidationFailedError extends Error {
  static readonly errorName = 'ValidationFailedError' as const;
  readonly responseMessage: string;

  constructor({
    message = '入力値が不正です',
    responseMessage,
    options,
  }: {
    message?: string;
    responseMessage?: string;
    options?: ErrorOptions;
  } = {}) {
    super(message, options);
    this.name = ValidationFailedError.errorName;
    this.responseMessage = responseMessage || message;
  }

  toGraphql() {
    const response = new ValidationFailed();
    response.message = this.responseMessage;
    return response;
  }
}

@ObjectType()
export class ValidationFailed extends ErrorResult {
  static readonly errorName = ValidationFailedError.errorName;
  errorName = ValidationFailedError.errorName;
}
