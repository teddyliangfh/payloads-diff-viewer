// @ts-check
import antfu from '@antfu/eslint-config'

export default await antfu({
  vue: true,
  typescript: true,
  yaml: true,
  jsonc: true,
  formatters: true,
  ignores: [
    'cloudformation',
    '.nuxt/',
    '.output/',
    'dist/',
    'coverage/',
    'node_modules/',
  ],
}, {
  rules: {
    'node/prefer-global/process': 'off',
    'no-console': 'off',
    'ts/no-explicit-any': 'off',
    'ts/consistent-type-definitions': [
      'error',
      'type',
    ],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: true,
      },
    ],
    'vue/block-lang': [
      'error',
      {
        script: {
          lang: 'ts',
        },
      },
    ],
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'vue/define-macros-order': [
      'error',
      {
        order: [
          'defineOptions',
          'defineModel',
          'defineProps',
          'defineEmits',
          'defineSlots',
        ],
        defineExposeLast: true,
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
})
