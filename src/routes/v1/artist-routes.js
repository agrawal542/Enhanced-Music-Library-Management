const express = require("express");
const { ArtistController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");
const { ArtistValidation } = require("../../validations");

const router = express.Router();

router.get("/", UserMiddleware.verifyJWT, ArtistController.getArtists);
router.post("/add-artist", ArtistValidation.addArtistValidation, UserMiddleware.verifyJWT, ArtistController.addArtist);
router.get("/:artist_id", UserMiddleware.verifyJWT, ArtistController.getArtist);
router.put("/:artist_id", ArtistValidation.addArtistValidation, UserMiddleware.verifyJWT, ArtistController.updateArtist);
router.delete("/:artist_id", UserMiddleware.verifyJWT, ArtistController.deleteArtist);


module.exports = router;
