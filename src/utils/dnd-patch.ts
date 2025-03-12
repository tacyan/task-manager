/**
 * @fileoverview react-beautiful-dndのReact 19互換性パッチ
 * @description React 19環境下でreact-beautiful-dndを使用するための修正モジュール
 */

// このパッチは必要に応じてインポートされます
// 現在の実装では、BoardView.tsxで行ったuseStateとuseEffectによる遅延ロードの
// 実装でエラーを回避しているため、このファイルは参照用です

// React 19でreact-beautiful-dndを使用する際に必要になる可能性のあるパッチ
export const patchReactBeautifulDnd = () => {
  // グローバルオブジェクトに対するプロパティのモンキーパッチ
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.React = {
      ...window.React,
      // React 18以前の動作をエミュレート
      version: '18.0.0'
    };
  }
};

// エクスポートするが、必要に応じて使用
export default patchReactBeautifulDnd; 