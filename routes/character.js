const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/characters", async (req, res) => {
  try {
    const query = [];
    if (req.body.name) {
      //   const name = new RegExp(req.body.name, "i");
      query.push(`name=${req.body.name}`);
    }
    if (req.body.skip) {
      query.push(`skip=${req.body.skip}`);
    }
    const queries = query.join("&");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&${queries}`
        );
        console.log(response.data);
        res.json(response.data);
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
      }
    };
    fetchData();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/character/:characterId", async (req, res) => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.API_KEY}`
      );
      console.log(response.data);
      res.json(response.data);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  };
  fetchData();
});

module.exports = router;
