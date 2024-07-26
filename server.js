const express = require('express');
const path = require('path');
const { stringify } = require('querystring');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// Add a new card
app.post('/cards', (req, res) => {
    const { name, initiative } = req.body;
    if (name && !isNaN(initiative)) {
        let id = stringify(cards.length + 1);
        cards.push({ id, name, initiative });
        cards.sort((a, b) => b.initiative - a.initiative);
        res.status(201).send(cards);
    } else {
        res.status(400).send('Invalid data');
    }
});

// Get all cards
app.get('/cards', (req, res) => {
    res.send(cards);
});

// Delete a card
app.delete('/cards/:id', (req, res) => {
    const { id } = req.params;
    cards = cards.filter(card => card.id !== id);
    res.send(cards);
});

// Update a card's initiative
app.put('/cards/:id', (req, res) => {
    const { id } = req.params;
    const { initiative } = req.body;
    if (!isNaN(initiative)) {
        const card = cards.find(card => card.id === id);
        if (card) {
            card.initiative = initiative;
            cards.sort((a, b) => b.initiative - a.initiative);
            res.send(cards);
        } else {
            res.status(404).send('Card not found');
        }
    } else {
        res.status(400).send('Invalid initiative');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
