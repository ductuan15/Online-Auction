import { AuthErrorCode, CategoryErrorCode, ErrorCode } from './error-code.js'

type ErrorParams = {
  code: string
  message?: string
  metaData?: any
}

export class ErrorException extends Error {
  public status: number = 500
  public metaData: any = null
  public message: string = ''

  constructor({ code, message, metaData }: ErrorParams) {
    super(code)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = code
    this.status = 500
    this.message = message || ''
    this.metaData = metaData || null

    switch (code) {
      case ErrorCode.Unauthenticated:
        this.status = 401
        break
      case ErrorCode.MaximumAllowedGrade:
        this.status = 400
        break
      case ErrorCode.AsyncError:
        this.status = 400
        break
      case ErrorCode.NotFound:
        this.status = 404
        break
      case ErrorCode.BadRequest:
        this.status = 400
        break
      default:
        this.status = 500
        break
    }
  }
}

export class CategoryErrorException extends ErrorException {
  constructor({ code, message, metaData }: ErrorParams) {
    super({ code, metaData, message })
    switch (code) {
      case CategoryErrorCode.EmptyRequest:
        this.status = 400
        this.message = 'Empty request'
        break
      case CategoryErrorCode.UnknownCreateError:
        this.status = 500
        this.message = 'Cannot create category'
        break
      case CategoryErrorCode.UnknownUpdateError:
        this.status = 500
        this.message = 'Cannot update category'
        break
      case CategoryErrorCode.NameExisted:
        this.status = 400
        this.message = 'Category name existed'
        break
      case CategoryErrorCode.NotFound:
        this.status = 404
        this.message = 'Category not found'
        break
      case CategoryErrorCode.UnknownError:
        this.status = 418 // i'm a teapot!
        this.message = 'Cannot perform the request'
        break
      default:
        this.status = 500
        break
    }
  }
}

export class AuthError extends ErrorException {
  constructor({ code, message, metaData }: ErrorParams) {
    super({ code, metaData, message })
    switch (code) {
      case AuthErrorCode.NotVerified:
        this.status = 401
        break
      case AuthErrorCode.EmailAlreadyUsed:
        this.status = 400
        break
      case AuthErrorCode.TokenExpired:
        this.status = 498
        break
      case AuthErrorCode.WrongEmailOrPassword:
        this.status = 401
        this.message = 'Invalid Email or password'
        break
      case AuthErrorCode.AccountDisabled:
        this.status = 401
        break
      default:
        this.status = 500
        break
    }
  }
}
