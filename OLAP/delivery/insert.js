const { Pool, Client } = require("pg");
const data = require("./data.json");
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "IPT1",
    password: "21091997",
    port: 5432
});
client.connect();

data.forEach(delivery=>{
    const queryText =
        "INSERT INTO delivery(SPID, SID, PID, Quatity, Price, ShipDate) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [
        delivery.SPID,
        delivery.SID,
        delivery.PID,
        delivery.Quantity,
        delivery.Price,
        delivery.ShipDate,
    ];
    client
        .query(queryText, values)
        .then(res => {
            if (res.rows.length){
                console.log(res.rows[0]);
            }})
        .catch(e => console.error(e.stack));
})
