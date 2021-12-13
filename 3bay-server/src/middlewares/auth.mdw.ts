import e from 'express'
import bcrypt from 'bcrypt'
import config from '../config/config.js'

/**
 * Hash the raw password (from req.body.pwd) by using bcrypt
 * @param req
 * @param res
 * @param next
 */
export async function hashPassword(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
) {
  if (req.body && req.body.pwd) {
    req.body.pwd = await bcrypt.hash(req.body.pwd, config.SALT_ROUND)
  }
  next()
}