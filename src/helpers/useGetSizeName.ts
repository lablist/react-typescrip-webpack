import { useState, useEffect } from 'react';
import useEvent from './useEvent';
import useThrottle from './useThrottle';

const defWidths = [1400, 1200, 992, 768, 576];
const defNames = ["xxxl", "xxl", "xl", "lg", "md", "sm"];

export const useGetSizeName = (widths:number[]=defWidths, names:string[]=defNames) => {
  const [sizeName, setSizeName] = useState<any>("");
  if (widths.length === 0 || names.length === 0) {
    return sizeName;
  }

  const listener = () => {
    try {
      widths.forEach((widthItem, widthsIndex) => {
        const media = window.matchMedia(`(min-width: ${widthItem}px)`);
        const curName = names[widthsIndex];
        if (media.matches && curName !== sizeName) {
          setSizeName(curName);
          throw 'Break';
        }
        if (!media.matches && widthItem === widths[widths.length - 1] && curName !== sizeName) {
          setSizeName(names[names.length - 1]);
        }
      })
    } catch (e) {
      if (e !== 'Break') throw e
    }
  };
  useEffect(()=>{listener()}, []);

  const throttledListener = useThrottle(listener, 750);
  useEvent(window, 'resize', throttledListener, true)

  return [sizeName];
}

export default useGetSizeName;
