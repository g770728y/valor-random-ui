/**
 * @class ExampleComponent
 */

import * as React from 'react';

// import styles from './styles.css'

// export type Props = { text: string }

// export default class ExampleComponent extends React.Component<Props> {
//   render() {
//     const {
//       text
//     } = this.props

//     return (
//       <div className={styles.test}>
//         Example Component: {text}
//       </div>
//     )
//   }
// }

import { TreeNode as FlatTreeNode } from './FlatTree/index.interface';
import FlatTree, { FlatTreeHelper } from './FlatTree';
export { FlatTree, FlatTreeHelper, FlatTreeNode };

import { Center } from './layout';
export { Center };
