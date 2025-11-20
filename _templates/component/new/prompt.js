module.exports = [
  {
    type: "input",
    name: "name",
    message: "Component name (e.g., MyButton):",
    validate: (value) => {
      if (!value) return "Component name is required";
      if (!/^[A-Z]/.test(value)) return "Component name must start with uppercase letter";
      return true;
    },
  },
  {
    type: "select",
    name: "category",
    message: "Component category:",
    choices: ["design-system", "dashboard", "shared", "layout", "forms"],
  },
];
