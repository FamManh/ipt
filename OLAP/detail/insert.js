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
data.forEach(detail=>{
    const queryText =
        "INSERT INTO detail(PID, PName, Color, Weight, PCity) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [
        detail.PID,
        detail.PName,
        detail.Color,
        detail.Weight,
        detail.PCity
    ];
    client
        .query(queryText, values)
        .then(res => {
            if (res.rows.length){
                console.log(res.rows[0]);
            }})
        .catch(e => console.error(e.stack));
})



