const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/characters/:skip", async (req, res) => {
  try {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&skip=${req.params.skip}`
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

router.get("/characters/:skip/:name", async (req, res) => {
  try {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&skip=${req.params.skip}&name=${req.params.name}`
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
