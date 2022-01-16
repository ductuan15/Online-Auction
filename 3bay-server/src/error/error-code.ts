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
  public static readonly ProductExisted = 'CategoryProductExisted'
}

export class AuthErrorCode {
  public static readonly EmailAlreadyUsed = 'AuthEmailAlreadyUsed'
  public static readonly WrongEmailOrPassword = 'AuthWrongEmailOrPassword'
  public static readonly NotVerified = 'AuthEmailNotConfirmed'
  public static readonly TokenExpired = 'AuthTokenExpired'
  public static readonly AccountDisabled = 'AuthAccountDisabled'
  public static readonly InvalidRequest = 'AuthInvalidRequest'
  public static readonly WrongOTP = 'AuthWrongOTP'
  public static readonly OTPExpired = 'AuthOTPExpired'
  public static readonly OTPNotExpired = 'AuthOTPNotExpired'
  public static readonly AccountNotExist = 'AuthAccountNotExisted'
  public static readonly AlreadyVerified = 'AuthAlreadyVerified'
  public static readonly RecaptchaFailed = 'AuthRecaptchaFailed'
  public static readonly WrongPassword = 'AuthWrongPassword'
  public static readonly NotHavePermission = 'AuthNotHavePermisison'
}

export class UserErrorCode {
  public static readonly CannotDeleteUser = 'UserErrorCannotDeleteUser'
}

export class BidErrorCode {
  public static readonly InvalidBidAmount = 'InvalidBidAmount'
  public static readonly InBlacklist = 'IsInBlacklist'
  public static readonly InvalidScore = 'InvalidScore'
  public static readonly HavingPendingBid = 'HavingPendingBid'
  public static readonly ClosedAuction = 'AuctionHasBeenClosed'
  public static readonly SelfBid = 'SelfBid'
  public static readonly AlreadyWinningAuction = 'AlreadyWinningAuction'
  public static readonly BidderNotFound = 'BidBidderNotFound'
  public static readonly NotAcceptedYet = 'NotAcceptedYet'
  public static readonly NotBidOwner = 'NotBidOwner'
}

export class AuctionErrorCode {
  public static readonly NotWinner = 'NotWinner'
  public static readonly NotClosedAuction = 'AuctionsNotClosed'
  public static readonly NotProductOwner = 'NotProductOwner'
  public static readonly ClosedAuction = 'ClosedAuction'
}
