import React, {Fragment} from 'react';

const IF = ({condition, children}) => {
  if (!condition) return null;
  return <Fragment>{children}</Fragment>;
};

export default IF;
