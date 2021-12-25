import {
  AuthErrorCode,
  CategoryErrorCode,
  ErrorCode,
  UserErrorCode,
} from './error-code.js'

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
      case CategoryErrorCode.ProductExisted:
        this.status = 403
        this.message = 'Product existed in this category'
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
      case AuthErrorCode.EmailAlreadyUsed:
        this.message = 'This email address is already used'
        this.status = 400
        break
      case AuthErrorCode.WrongEmailOrPassword:
        this.status = 401
        this.message = 'Invalid Email or password'
        break
      case AuthErrorCode.NotVerified:
        this.status = 401
        this.message = 'Account is not verified'
        break
      case AuthErrorCode.TokenExpired:
        this.status = 498
        break
      case AuthErrorCode.AccountDisabled:
        this.status = 401
        this.message = 'Account is disabled'
        break
      case AuthErrorCode.InvalidRequest:
        this.message = 'Invalid Request'
        this.status = 401
        break
      case AuthErrorCode.WrongOTP:
        this.status = 401
        this.message = 'Invalid OTP code'
        break
      case AuthErrorCode.OTPExpired:
        this.status = 498
        this.message = 'OTP code has expired'
        break
      case AuthErrorCode.OTPNotExpired:
        this.status = 400
        this.message = 'OTP code has not expired yet'
        break
      case AuthErrorCode.AccountNotExist:
        this.status = 401
        this.message = 'Email does not exist'
        break
      case AuthErrorCode.AlreadyVerified:
        this.status = 400
        this.message = 'Account is already verified'
        break
      case AuthErrorCode.RecaptchaFailed:
        this.status = 401
        this.message = 'Failed to verify recaptcha'
        break
      case AuthErrorCode.WrongPassword:
        this.status = 401
        this.message = 'Wrong password'
        break
      case AuthErrorCode.NotHavePermission:
        this.status = 403
        break
      default:
        this.status = 500
        break
    }
  }
}

export class UserError extends ErrorException {
  constructor({ code, message, metaData }: ErrorParams) {
    super({ code, metaData, message })
    switch (code) {
      case UserErrorCode.CannotDeleteUser:
        this.message = 'Cannot delete user'
        this.status = 403
        break
      default:
        this.status = 500
        break
    }
  }
}
