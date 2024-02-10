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
      if (user.favourites.comics.length > 0) {
        for (let i = 0; i < user.favourites.comics.length; i++) {
          if (user.favourites.comics[i].id === req.params.comicId) {
            console.log("comic already in favourites");
            return res.status(400).json({
              message: "Cette bande dessinée est déjà dans les favoris !",
            });
          }
        }
      }
      const title = req.body.title;
      const picture = req.body.picture;
      const comics = [...user.favourites.comics];
      const characters = [...user.favourites.characters];
      comics.push({ id: req.params.comicId, title: title, picture: picture });

      const FavouritesToUpdate = await User.findByIdAndUpdate(
        userFound._id,
        {
          favourites: {
            comics: comics,
            characters: characters,
          },
        },
        { new: true }
      );
      await FavouritesToUpdate.save();
      res.status(200).json(FavouritesToUpdate.favourites.comics);
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
      const comics = [...user.favourites.comics];
      const characters = [...user.favourites.characters];
      let count = 0;
      const response = {};
      for (let i = 0; i < comics.length; i++) {
        if (comics[i] === comicToDelete) {
          count++;
          comics[i] = "zzzzzzzzzzzzzzzzzzzz";
          comics.sort();
          comics.pop();
          response.message =
            "La bande dessinée a bien été supprimée des favoris";
          break;
        }
      }
      if (count === 0) {
        response.message =
          "Aucune bande dessinée ne correspond à cet id dans les favoris";
      }
      const FavouritesToUpdate = await User.findByIdAndUpdate(userFound._id, {
        favourites: {
          comics: comics,
          characters: characters,
        },
      });
      await FavouritesToUpdate.save();
      res.status(200).json(response.message);
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
      console.log(req.params.characterId);
      console.log(req.body);
      const userFound = req.userFound;

      const user = await User.findOne({ email: userFound.email });
      if (user.favourites.characters.length > 0) {
        for (let i = 0; i < user.favourites.characters.length; i++) {
          if (user.favourites.characters[i].id === req.params.characterId) {
            console.log("character already in favourites");
            return res.status(400).json({
              message: "Ce personnage est déjà dans les favoris !",
            });
          }
        }
      }
      const name = req.body.name;
      const picture = req.body.picture;
      const comics = [...user.favourites.comics];
      const characters = [...user.favourites.characters];
      characters.push({
        id: req.params.characterId,
        name: name,
        picture: picture,
      });
      console.log(characters);
      const FavouritesToUpdate = await User.findByIdAndUpdate(
        userFound._id,
        {
          favourites: {
            comics: comics,
            characters: characters,
          },
        },
        { new: true }
      );
      await FavouritesToUpdate.save();
      res.status(200).json(FavouritesToUpdate.favourites.characters);
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
      const characterToDelete = req.params.characterId;
      const user = await User.findOne({ email: userFound.email });
      const comics = [...user.favourites.comics];
      const characters = [...user.favourites.characters];
      let count = 0;
      const response = {};
      for (let i = 0; i < characters.length; i++) {
        if (characters[i] === characterToDelete) {
          count++;
          characters[i] = "zzzzzzzzzzzzzzzzzzzz";
          characters.sort();
          characters.pop();
          response.message = "Le personnage a bien été supprimé des favoris";
          break;
        }
      }
      if (count === 0) {
        response.message =
          "Aucun personnage ne correspond à cet id dans les favoris";
      }
      const FavouritesToUpdate = await User.findByIdAndUpdate(userFound._id, {
        favourites: {
          comics: comics,
          characters: characters,
        },
      });
      await FavouritesToUpdate.save();
      res.status(200).json(response.message);
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
