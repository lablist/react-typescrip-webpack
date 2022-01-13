import { useRef, useState } from 'react';
import useEvent from './useEvent';
import useThrottle from './useThrottle';

const _getPercent = (element) => {
  if (element === null) {
    return 0;
  }
  const height = element.scrollHeight - element.clientHeight;
  return Math.round((element.scrollTop / height) * 100);
}

export default (props) => {
  const {
    onScroll
  } = props;
  const scrollRef = useRef(null);
  const [percent, setPercent] = useState(0);
  const handler = (e) => {
    if ((onScroll).constructor === Function) {
      onScroll(e);
    }
    setPercent(_getPercent(e.target))
  };
  const throttledHandler = useThrottle(handler, 100);
  useEvent(scrollRef?.current, 'scroll', throttledHandler, true, { passive: true })
  return [scrollRef, percent];
}
