module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Page name (e.g., MyNewPage):',
    validate: (value) => {
      if (!value) return 'Page name is required';
      if (!/^[A-Z]/.test(value)) return 'Page name must start with uppercase letter';
      return true;
    },
  },
];
