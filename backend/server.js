import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/api/test", (req, res) => {
    res.json({
        message: "Hello from server sakupintar!",
    });
});

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});