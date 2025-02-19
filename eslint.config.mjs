import eslint from '@eslint/js'
import tselint from 'typescript-eslint'

export default tselint.config(
  {
    ignores: ['**/public/**', '**/dist/**', 'server.cjs'],
  },
  eslint.configs.recommended,
  tselint.configs.strict,
);
