const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/comics/:skip", async (req, res) => {
  try {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&skip=${req.params.skip}`
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

router.get("/comics/:skip/:title", async (req, res) => {
  try {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&skip=${req.params.skip}&title=${req.params.title}`
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

router.get("/comics/:characterId", async (req, res) => {
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

router.get("/comic/:comicId", async (req, res) => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comic/${req.params.comicId}?apiKey=${process.env.API_KEY}`
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
