module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    'ecmaVersion': 2018,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'max-len': ['error', {'code': 150}], // Satır uzunluğunu 100 karaktere çıkarttık
    'indent': ['error', 2], // 2 boşlukla girinti yapmayı zorunlu kılar
    'object-curly-spacing': ['error', 'never'], // Obje parantezlerinde boşluk olmamalı
    'space-before-function-paren': ['error', 'never'], // Fonksiyon parantezlerinden önce boşluk olmamalı
    'comma-dangle': ['error', 'always-multiline'], // Son virgül zorunlu
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
