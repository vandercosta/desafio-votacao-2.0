import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended', eslintConfigPrettier],
    languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    files: ['tests/**/*.js'], // só para os testes
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // habilita describe, it, beforeAll, etc
      },
    },
  },
  {
    ignores: ['mongo-init/**'],
  },
]);
