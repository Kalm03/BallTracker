const express = require('express');
const path = require('path');
const { stringify } = require('querystring');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

let ball = {
    position: { i: 0, j: 0, k: 0 },
    MP: 0,
    AC: 8,
    damageType: 'Bludgeoning'
};

let cards = [{ id: '1', name: 'Elit', initiative: 15 }, { id: '2', name: 'Lionel', initiative: 10 }, { id: '3', name: 'Jam', initiative: 5 }];

app.post('/update', ({ body: { i, j, k, damageType } }, res) => {
    ball.position.i += i;
    ball.position.j += j;
    ball.position.k += k;

    const damage = Math.sqrt(
        ball.position.i ** 2 +
        ball.position.j ** 2 +
        ball.position.k ** 2
    );

    ball.MP = Math.floor(damage / 2);
    ball.AC = 8 + ball.MP;
    ball.damageType = damageType;

    res.json(ball);
});

app.post('/stop', (req, res) => {
    ball.MP = Math.floor(ball.MP / 2);
    ball.AC = 8 + ball.MP;
    res.json(ball);
});


app.post('/reset', (req, res) => {
    ball = {
        position: { i: 0, j: 0, k: 0 },
        MP: 0,
        AC: 8,
        damageType: 'Bludgeoning'
    };
    res.json(ball);
});

app.get('/status', (req, res) => {
    res.json(ball);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
