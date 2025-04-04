
const express = require('express');
const cors = require('cors');
const sql = require('./db');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const getTasks = async () => {
    const tasks = await sql`select * from tasks`
    return tasks;
}

app.get('/tasks', async (req, res, next) => {
    const tasks = await getTasks();
    res.status(200).json({
        tasks: tasks
    });
});

app.post('/task', async (req, res, next) => {
    try {
        if (!req.body.newTask) {
            res.status(400).json({
                message: 'Please give task in newTask'
            });
            return;
        }

       await sql`INSERT INTO tasks (name) VALUES (${req.body.newTask})`;

        res.status(200).json({
            message: 'Task added successfully'
        });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({
            message: 'Something went wrong',
            error: error
        });
    }
});

app.delete('/task/:taskId', async (req, res, next) => {
    try {
        await sql`DELETE FROM tasks where id = ${req.params.taskId}`
        res.status(200).json({
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({
            error: error
        });
    }
});

app.put('/task/:taskId', async (req, res, next) => {
    try {
        await sql`UPDATE tasks SET name=${req.body.newTask} WHERE id=${req.params.taskId}`;
        res.status(200).json({
            message: 'Task updated successfully'
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({
            error: error
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});