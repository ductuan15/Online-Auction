import { EffectCallback, useEffect } from 'react'

/**
 * @param effect
 * @see https://usehooks-ts.com/react-hook/use-effect-once
 */
function useEffectOnce(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}

export default useEffectOnce