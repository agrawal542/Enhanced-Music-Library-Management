const { Op } = require("sequelize");
const { ArtistRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

const artistRepository = new ArtistRepository();


async function addArtist(data) {
    data.artist_id = "artist_" + Math.random().toString(36).substr(2, 9); // Generate unique org_id
    return artistRepository.create(data);
}

async function getArtist(data) {
    const artist = await artistRepository.getArtist(data.artist_id, data.org_id);
    if (!artist) throw new AppError("Artist not found.", StatusCodes.NOT_FOUND);
    return artist;
}

async function updateArtist(data) {
    const artist = await artistRepository.getArtist(data.artist_id, data.org_id);
    if (!artist) throw new AppError("Artist not found.", StatusCodes.NOT_FOUND);
    const updatData = {
        name: data.name,
        grammy: data.grammy,
        hidden: data.hidden,
    }
    return artistRepository.updateArtist(data.artist_id, data.org_id, updatData);
}

async function deleteArtist(data) {
    const artist = await artistRepository.getArtist(data.artist_id, data.org_id);
    if (!artist) throw new AppError("Artist not found.", StatusCodes.NOT_FOUND);
    return artistRepository.updateArtist(data.artist_id, data.org_id, { status: 0 }); // mark status is 0(soft delete)
}

async function getArtists(data, query) {
    try {
        let customWhereFilter = {
            org_id: data.org_id,
            status: { [Op.ne]: 0 }  // remove the deleted artist
        };
        let customOrderFilter = [['createdAt', 'ASC']];
        const limit = query.limit ? parseInt(query.limit, 10) : 5;
        const offset = query.offset ? parseInt(query.offset, 10) : 1;

        if (query.grammy) {
            customWhereFilter.grammy = query.grammy;
        }
        if (query.hidden !== undefined && query.hidden !== null) {
            customWhereFilter.hidden = query.hidden;
        }
        if (query.sort) {
            const params = query.sort.split(',');
            params.forEach(element => {
                const info = element.split('_');
                customOrderFilter.push(info)
            });
        }
        const artists = await artistRepository.getAllArtist(customWhereFilter, customOrderFilter, limit, offset);
        return { artists, total_record: artists.length };
    } catch (error) {
        throw error;
    }
}


module.exports = {
    addArtist,
    getArtist,
    updateArtist,
    deleteArtist,
    getArtists,
};
