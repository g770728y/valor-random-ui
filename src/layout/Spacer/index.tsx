import * as React from 'react';

interface IProps {
  size?: number;
  flex?: 'auto' | 'none';
}

const HSpacer_: React.FC<IProps> = ({ size = 10, flex = 'none' }) => (
  <div style={{ width: size, height: 1, flex }} />
);

export const HSpacer = React.memo(HSpacer_);

const VSpacer_: React.FC<IProps> = ({ size = 10, flex = 'none' }) => (
  <div style={{ width: 1, height: size, flex }} />
);

export const VSpacer = React.memo(VSpacer_);
