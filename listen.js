const app = require('./app');
const PORT = 9090;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port ${PORT}`)
});
