import { useState, useEffect } from 'react';

export const useCustomEvent = (event) => {
  const [value, updateValue] = useState(undefined);

  const onEvent = ({detail}) => {
    updateValue(detail);
  };

  useEffect(() => {
    window.addEventListener(event, (e) => onEvent(e));
    return () => window.removeEventListener(event, (e) => onEvent(e));
  });

  return [
    value,
    (detail) => {
      window.dispatchEvent(
        new CustomEvent(event, {
          detail,
        }),
      );
    },
  ];
};

export default useCustomEvent;
