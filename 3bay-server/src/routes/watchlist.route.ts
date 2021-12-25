import { Router } from 'express'
import passport from '../auth/passport.js'

import * as watchListController from '../controllers/watchlist.controller.js'
import {deleteWatchList} from "../controllers/watchlist.controller.js";

const router = Router()

router
  .route('/byUser')
  .get(
    passport.authenticate('jwt', { session: false }),
    watchListController.getWatchListByUser,
  )

router
  .route('/byUser/:productId')
  .post(
    passport.authenticate('jwt', { session: false }),
    watchListController.add,
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    watchListController.deleteWatchList,
  )

export default router
