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

data.forEach(supplier=>{
    const queryText =
        "INSERT INTO supplier(SID, SName, SCity, Address, Risk) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [
        supplier.SID,
        supplier.SName,
        supplier.SCity,
        supplier.Address,
        supplier.Risk
    ];
    client
        .query(queryText, values)
        .then(res => {
            if (res.rows.length){
                console.log(res.rows[0]);
            }})
        .catch(e => console.error(e.stack));
})



