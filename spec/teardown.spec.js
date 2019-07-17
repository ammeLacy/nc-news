const connection = require('../db/connection.js')

after(() => {
  connection.destroy();
})
