module.exports = {
  '*.{js,ts,json}': ['eslint --fix', 'prettier --write'],
  '*': 'vitest related --run',
};
