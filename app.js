express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { readUsers, readUserById, writeUsers } = require('./Common');

const filePath = path.join(__dirname, 'user.json');
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/users', async (req, res) => {
    try {
        const data = await readUsers(filePath);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'internal server error' });
    }
});

app.get("/users/search", async (req, res) => {
    try {
        const users = await readUsers(filePath);
        const { name, city, role, age } = req.query;
        const result = users.filter(u =>
            (!name || u.name?.toLowerCase().includes(name.toLowerCase())) &&
            (!city || u.city?.toLowerCase().includes(city.toLowerCase())) &&
            (!role || u.role?.toLowerCase().includes(role.toLowerCase())) &&
            (!age || u.age === Number(age)
            )
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'internal server error' });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'id is required' });
        }
        const data = await readUserById(filePath, req.params.id);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'internal server error' });
    }
});

app.post("/users", (req, res) => {
    const users = readUsers(filePath);
    const { name, city, role, age } = req.body;

    if (!name || !city) {
        return res.status(400).json({ message: "Name & City required" });
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        city,
        role: role || "",
        age: age || null
    };

    users.push(newUser);
    writeUsers(filePath, users);

    res.status(201).json(newUser);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'internal server error' });
});

app.listen(port, () => {
    console.log('server is runing on port number ', port);
})
