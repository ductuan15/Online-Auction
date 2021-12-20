import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import {
  ExtractJwt,
  Strategy as JWTStrategy,
  StrategyOptions,
} from 'passport-jwt'
import config from '../config/config.js'
import prisma from '../db/prisma.js'
import Prisma from '@prisma/client'
import bcrypt from 'bcrypt'

async function findUser(email: string): Promise<Prisma.User | undefined> {
  const user = await prisma.user.findUnique({
    where: { email: email },
  })
  return user ? user : undefined
}

export async function verifyPassword(
  user: Prisma.User,
  password: string,
): Promise<boolean> {
  // console.log(password, user.pwd)
  return await bcrypt.compare(password, user.pwd)
}

async function verifyUser(
  uuid: string,
  role: string,
): Promise<Prisma.User | undefined> {
  const user = await prisma.user.findUnique({
    where: { uuid: uuid },
  })
  if (user && role === user?.role && !user.isDisabled && user.verified) {
    return user
  }
  return undefined
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pwd',
      session: false,
    },
    async (username: string, password: string, done: any) => {
      let user
      try {
        user = await findUser(username)
      } catch (e) {
        return done(e)
      }
      if (!user)
        return done(
          null,
          false,
          /*new AuthError({ code: AuthErrorCode.WrongEmailOrPassword }),*/
        )
      if (await verifyPassword(user, password)) return done(null, user)
      return done(null, false)
    },
  ),
)

// 2 passport-jwtの設定
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT,
}

passport.use(
  new JWTStrategy(opts, async (jwtPayload: any, done: any) => {
    // console.log(jwtPayload)
    try {
      if (!jwtPayload.user && !jwtPayload.role) return done(null, false)
      const user = await verifyUser(jwtPayload.user, jwtPayload.role)
      // console.log(user)
      if (user) {
        return done(null, user)
      }
      return done(null, false)
    } catch (e) {
      return done(e, false)
    }
  }),
)

export default passport
