const { StatusCodes } = require("http-status-codes");
const { SuccessResponse } = require("../utils/common");
const { ArtistService } = require("../services");


async function addArtist(req, res, next) {
    try {
        const artist = await ArtistService.addArtist({
            name: req.body.name,
            org_id: req.user.org_id,
            grammy: req.body.grammy,
            hidden: req.body.hidden,
            created_by: req.user.user_id
        });
        SuccessResponse.message = "Artist created successfully.";
        SuccessResponse.data = artist;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

async function getArtist(req, res, next) {
    try {
        const artist = await ArtistService.getArtist({ artist_id: req.params.artist_id, org_id: req.user.org_id });
        SuccessResponse.message = "Artist retrieved successfully.";
        SuccessResponse.data = artist;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

async function updateArtist(req, res, next) {
    try {
        await ArtistService.updateArtist({
            name: req.body.name,
            grammy: req.body.grammy,
            hidden: req.body.hidden,
            artist_id: req.params.artist_id,
            org_id: req.user.org_id
        });
        SuccessResponse.message = "Artist updated successfully.";
        SuccessResponse.data = {};
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

async function deleteArtist(req, res, next) {
    try {
        await ArtistService.deleteArtist({ artist_id: req.params.artist_id, org_id: req.user.org_id });
        SuccessResponse.message = "Artist deleted successfully.";
        SuccessResponse.data = {};
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

async function getArtists(req, res, next) {
    try {
        const artists = await ArtistService.getArtists(
            { org_id: req.user.org_id },
            req.query
        );
        SuccessResponse.message = "Artists retrieved successfully.";
        SuccessResponse.data = artists;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getArtists,
    getArtist,
    addArtist,
    updateArtist,
    deleteArtist,
};
