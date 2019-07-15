import * as React from 'react';

type Props = {
  inline?: boolean;
  width?: string | number;
  height?: string | number;
} & React.HTMLAttributes<HTMLElement>;

const Center: React.FC<Props> = ({
  inline = true,
  width = 'auto',
  height = 'auto',
  style,
  className,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
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
