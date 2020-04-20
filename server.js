const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`app listeniong on port ${port}`));
