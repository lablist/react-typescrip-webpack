import { useMemo } from 'react';
import { isFunction, throttle, isUndefined } from 'lodash';

/**
 * Throttle callback in milliseconds
 * Example: const throttledHandleScroll = useThrottle(handleScroll, 100, []);
 * @param {fuction} callback
 * @param {number} milliseconds
 * @param {array} deps
 * @returns {fuction} throttled callback
 */
export const useThrottle = (
  callback = undefined,
  milliseconds = 100,
  deps = [],
) => {
  if (isFunction(callback)) {
    return useMemo(() => {
      const throttled = throttle((e, props = undefined) => callback(e, props), milliseconds);
      return (e: any, props = undefined) => {
        if (!isUndefined(e.persist)) {
          e.persist();
        }
        return throttled(e, props);
      };
    }, deps);
  }
};

export default useThrottle;
