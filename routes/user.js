const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const User = require("../models/User");

const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const SHA256 = require("crypto-js/sha256");

router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password, newsletter } = req.body;
    const emailAlreadyUsed = await User.findOne({ email });
    if (emailAlreadyUsed !== null) {
      return res
        .status(400)
        .json({ message: "Adresse email déjà existante 🙀" });
    }
    const salt = uid2(24);
    const token = uid2(18);
    const newUser = new User({
      email,
      account: {
        username,
      },
      favourites: {
        comics: [],
        characters: [],
      },
      newsletter,
      token: token,
      salt: salt,
      hash: SHA256(password + salt).toString(encBase64),
    });
    console.log(`New User ${req.body.username} created 👏`);
    await newUser.save();
    return res.status(200).json({
      _id: newUser._id,
      token: token,
      account: {
        username: newUser.account.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const hashLogin = SHA256(req.body.password + user.salt).toString(encBase64);
    if (hashLogin === user.hash) {
      console.log("Password OK 👌");
      res.status(200).json({
        _id: user._id,
        token: user.token,
        account: {
          username: user.account.username,
        },
      });
    } else {
      return res.status(401).json({ message: "Mot de passe incorrect 😾" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post(
  "/user/addFavouriteComics/:comicId",
  isAuthenticated,
  async (req, res) => {
    try {
      const userFound = req.userFound;
      const user = await User.findOne({ email: userFound.email });
      console.log(user);
      const comics = user.favourites.comics;
      const characters = user.favourites.characters;
      const newComics = comics.push(req.params.comicId);

      const FavouritesToUpdate = await User.findByIdAndUpdate(userFound._id, {
        favourites: {
          comics: newComics,
          characters: characters,
        },
      });
      await FavouritesToUpdate.save();
      res.status(200).json(user.favourites.comics);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/user/removeFavouriteComics/:comicId",
  isAuthenticated,
  async (req, res) => {
    try {
      const userFound = req.userFound;
      const comicToDelete = req.params.comicId;
      const user = await User.findOne({ email: userFound.email });
      const comics = user.favourites.comics;
      const characters = user.favourites.characters;
      for (let i = 0; i < comics.length; i++) {
        if ((comics[i] = comicToDelete)) {
          comics[i] = "zzzzzzzzzzzzzzzzzzzz";
        }
        comics.pop();
      }
      const FavouritesToUpdate = await User.findByIdAndUpdate(userFound._id, {
        favourites: {
          comics: comics,
          characters: characters,
        },
      });
      await FavouritesToUpdate.save();
      res
        .status(200)
        .json(`La bande dessinée a bien été supprimée des favoris`);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/user/addFavouriteCharacter/:characterId",
  isAuthenticated,
  async (req, res) => {
    try {
      const userFound = req.userFound;
      const user = await User.findOne({ email: userFound.email });
      console.log(user);
      const comics = user.favourites.comics;
      const characters = user.favourites.characters;
      const newCharacters = characters.push(req.params.characterId);

      const FavouritesToUpdate = await User.findByIdAndUpdate(userFound._id, {
        favourites: {
          comics: comics,
          characters: newCharacters,
        },
      });
      await FavouritesToUpdate.save();
      res.status(200).json(user.favourites.characters);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/user/removeFavouriteCharacter/:characterId",
  isAuthenticated,
  async (req, res) => {
    try {
      const userFound = req.userFound;
      const characterToDelete = req.params.comicId;
      const user = await User.findOne({ email: userFound.email });
      const comics = user.favourites.comics;
      const characters = user.favourites.characters;
      for (let i = 0; i < characters.length; i++) {
        if ((characters[i] = characterToDelete)) {
          characters[i] = "zzzzzzzzzzzzzzzzzzzz";
        }
        characters.pop();
      }
      const FavouritesToUpdate = await User.findByIdAndUpdate(userFound._id, {
        favourites: {
          comics: comics,
          characters: characters,
        },
      });
      await FavouritesToUpdate.save();
      res.status(200).json(`Le personnage a bien été supprimé des favoris`);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/userData/", isAuthenticated, async (req, res) => {
  try {
    const userFound = req.userFound;
    const user = await User.findOne({ email: userFound.email });
    console.log(user);

    const response = {
      username: user.account.username,
      email: user.email,
      favourites: {
        comics: user.favourites.comics,
        characters: user.favourites.characters,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
