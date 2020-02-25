const express = require('express');
const wol = require('wake_on_lan');
const bodyparser = require('body-parser');
const app = express();
const port = 7878;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post("/wake-pc", (req, res) => {
    console.log(req.body);

    if(req.body.ip && req.body.mac) {
        let options = {
            address: req.body.ip,
            num_packets: req.body.packets || 3,
            interval: req.body.interval || 100,
            port: req.body.port || 9
        };
        wol.wake(req.body.mac, options, function (error) {
            if (error) {
                res.status(500).send({
                    status: 202,
                    message: "Failed to send request",
                    error: error,
                    data: req.body,
                    options: options
                });
            } else {
                res.status(202).send({
                    status: 202,
                    message: "Successfully sent request",
                    data: req.body,
                    options: options
                });
            }
        });
    } else {
        res.status(400).send({
            status: 400,
            message: "IP and Mac Address must be provided."
        })
    }

});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});