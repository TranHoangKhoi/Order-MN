module.exports = {
  printWidth: 100,
  tabWidth: 2,
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '<BUILT_IN_MODULES>',
    '^(@(store|schemas|locale|hooks|types|navigators|services|constants|screens|modules|components))',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
