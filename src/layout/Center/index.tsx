import * as React from 'react';

interface Props {
  inline?: boolean;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

const Center: React.FC<Props> = ({
  inline = true,
  width = 'auto',
  height = 'auto',
  style,
  className,
  children
}) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        width: width || 'auto',
        height: height || 'auto',
        display: inline ? 'inline-flex' : 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {children}
    </div>
  );
};

export default Center;
