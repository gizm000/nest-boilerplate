import { ObjectType } from '@nestjs/graphql';
import { ErrorResult } from '../grpahql/objects/error-result';

export class DataNotFoundError extends Error {
  static readonly errorName = 'DataNotFoundError' as const;
  readonly responseMessage: string;

  constructor({
    message = '指定されたデータがみつかりません',
    responseMessage,
    options,
  }: {
    message?: string;
    responseMessage?: string;
    options?: ErrorOptions;
  } = {}) {
    super(message, options);
    this.name = DataNotFoundError.errorName;
    this.responseMessage = responseMessage || message;
  }

  toGraphql() {
    const response = new DataNotFound();
    response.message = this.responseMessage;
    return response;
  }
}

@ObjectType()
export class DataNotFound extends ErrorResult {
  static readonly errorName = DataNotFoundError.errorName;
  errorName = DataNotFoundError.errorName;
}
