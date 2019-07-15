import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Center from '.';

storiesOf('layout/Center', module)
  .add('inline', () => (
    <div>
      <Center
        style={{ background: 'red' }}
        width={100}
        height={100}
        inline={true}
      >
        test
      </Center>
      行内显示
    </div>
  ))
  .add('block', () => (
    <div>
      <Center
        style={{ background: 'red' }}
        width={100}
        height={100}
        inline={false}
      >
        test
      </Center>
      块显示
    </div>
  ));
