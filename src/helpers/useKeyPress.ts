import { useState } from 'react';
import useEvent from './useEvent';
import useThrottle from './useThrottle';

/**
 * Add keypress tracking.
 * Example: const enterPressed = useKeyPress({targetKey: 'Enter', noSpam: true, element: ref.current, onPressDown: ()=>{}, onPressUp: ()=>{}, deps: []});
 * @param {object} props
 * @returns {boolean} keyPressed
 */

const useKeyPress = (props) => {
  const {
    targetKey,
    element = window,
    noSpam = true,
    onPressDown = () => {},
    onPressUp = () => {},
    deps = [],
  } = props;

  const [keyPressed, setKeyPressed] = useState(false);
  const [prevKey, setPrevKey] = useState('');

  const downHandler = (e: any) => {
    if (noSpam && prevKey === targetKey) {
      return;
    }
    if (e.key === targetKey) {
      setKeyPressed(true);
      setPrevKey(targetKey);
      onPressDown(e);
    }
  };

  const upHandler = (e: any) => {
    if (e.key === targetKey) {
      setKeyPressed(false);
      setPrevKey('');
      onPressUp(e);
    }
  };

  const downHandlerThrottled = useThrottle(downHandler, 100, deps);
  const upHandlerThrottled = useThrottle(upHandler, 100, deps);

  useEvent(element, 'keydown', downHandlerThrottled, true, false);
  useEvent(element, 'keyup', upHandlerThrottled, true, false);

  return keyPressed;
};

export default useKeyPress;
