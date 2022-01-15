import Prisma from '@prisma/client'
import { kindlyAskUserToLogout } from '../socket/user.io.js'
import c from 'ansi-colors'

const userMdw: Prisma.Prisma.Middleware = async (param, next) => {
  if (param.model === 'User') {
    switch (param.action) {
      case 'update':
      case 'upsert':
      case 'delete': {
        const result = await next(param)
        try {
          const refreshTokenChangedOrRemoved =
            param.args?.data?.refreshToken || param.action === 'delete'

          if (refreshTokenChangedOrRemoved && result?.uuid) {
            await kindlyAskUserToLogout(result?.uuid)
            console.log(
              c.blue(
                `[user.prisma.mdw] kindlyAskUserToLogout(${result?.uuid})`,
              ),
            )
          }
        } catch (e) {
          console.log(param)
          console.log(e)
        }
        return result
      }
      case 'updateMany':
      case 'deleteMany': {
        const results = await next(param)
        try {
          const refreshTokenChangedOrRemoved =
            param.args?.data?.refreshToken || param.action === 'deleteMany'

          if (refreshTokenChangedOrRemoved && results && results?.length > 0) {
            for (const user of results) {
              if (user && user?.uuid) {
                console.log(
                  c.blue(
                    `[user.prisma.mdw] kindlyAskUserToLogout(${user?.uuid})`,
                  ),
                )
                await kindlyAskUserToLogout(user?.uuid)
              }
            }
          }
        } catch (e) {
          console.log(param)
          console.log(e)
        }
        return results
      }
    }
  }
  return next(param)
}
export default userMdw
