const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const URL = 'https://syria-ex.com/';

app.get('/api/rates', async (req, res) => {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const results = {};
    $('.table-responsive tbody tr').each((_, el) => {
      const tds = $(el).find('td');
      const name = $(tds[0]).text().trim();
      const price = $(tds[1]).text().trim();
      if (name && price) {
        results[name] = price;
      }
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
