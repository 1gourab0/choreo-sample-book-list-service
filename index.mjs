const variables = require("./variables");

const app = require("./app");
const port = variables.PORT || 3000;

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
