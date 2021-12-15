export class ErrorCode {
  public static readonly Unauthenticated = 'Unauthenticated'
  public static readonly NotFound = 'NotFound'
  public static readonly MaximumAllowedGrade = 'MaximumAllowedGrade'
  public static readonly AsyncError = 'AsyncError'
  public static readonly UnknownError = 'UnknownError'
  public static readonly BadRequest = 'BadRequest'
}

export class CategoryErrorCode {
  public static readonly NotFound = 'CategoryNotFound'
  public static readonly NameExisted = 'CategoryNameExisted'
  public static readonly UnknownCreateError = 'CategoryUnknownCreateError'
  public static readonly UnknownUpdateError = 'CategoryUnknownUpdateError'
  public static readonly UnknownError = 'CategoryUnknownError'
  public static readonly EmptyRequest = 'CategoryEmptyRequest'
}

export class AuthErrorCode {
  public static readonly EmailAlreadyUsed = 'AuthEmailAlreadyUsed'
  public static readonly WrongEmailOrPassword = 'AuthWrongEmailOrPassword'
  public static readonly NotVerified = 'AuthEmailNotConfirmed'
  public static readonly TokenExpired = 'AuthTokenExpired'
  public static readonly AccountDisabled = 'AuthAccountDisabled'
  public static readonly InvalidRequest = 'AuthInvalidRequest'
  public static readonly WrongOTP = 'AuthWrongOTP'
}