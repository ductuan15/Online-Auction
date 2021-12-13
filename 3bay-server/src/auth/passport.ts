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

async function findUser(email: string): Promise<Prisma.users | undefined> {
  const user = await prisma.users.findUnique({
    where: { email: email },
  })
  return user ? user : undefined
}

async function verifyPassword(
  user: Prisma.users,
  password: string,
): Promise<boolean> {
  console.log(password, user.pwd)
  return await bcrypt.compare(password, user.pwd)
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
  new JWTStrategy(opts, (jwtPayload: any, done: any) => {
    done(null, jwtPayload)
  }),
)

export default passport
