import { useCallback, useState } from 'react';
import useEvent from './useEvent';
/**
 * Toggle helper.
 * @param {boolean} toggle flag
 * @returns {array} value and flag
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);
  return [value, toggle];
};

/**
 * Modal toggle helper deactivate by click outside.
 * @param {boolean} toggle flag
 * @param {RefObject} modal element
 * @returns {array} value and flag
 */
export const useModalToggle = (
  initialValue,
  elementRef,
  onClose = () => null,
) => {
  const [isActive, setIsActive] = useState(initialValue);

  const pageClickEvent = (e: Event) => {
    if (elementRef.current !== null && !elementRef.current.contains(e.target)) {
      setIsActive(!isActive);
      onClose();
    }
  };

  useEvent(window, 'click', pageClickEvent, isActive, false, elementRef);

  return [isActive, setIsActive];
};

export default {
  useToggle,
  useModalToggle,
};
