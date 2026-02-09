const db = require('./src/config/db');

(async ()=>{
  const [r] = await db.execute("SELECT 1 as ok");
  console.log(r);
})();
