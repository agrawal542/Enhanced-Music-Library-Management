const express = require("express");
const { ArtistController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");
const { ArtistValidation } = require("../../validations");

const router = express.Router();

// Apply verifyJWT middleware to all routes
router.use(UserMiddleware.verifyJWT);

router.get("/", ArtistController.getArtists);
router.post("/add-artist", ArtistValidation.addArtistValidation, ArtistController.addArtist);
router.get("/:artist_id", ArtistController.getArtist);
router.put("/:artist_id", ArtistValidation.addArtistValidation, ArtistController.updateArtist);
router.delete("/:artist_id", ArtistController.deleteArtist);

module.exports = router;
