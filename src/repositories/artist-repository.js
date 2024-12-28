const CrudRepository = require("./crud-repository");
const { Artist } = require("../models");

class ArtistRepository extends CrudRepository {
    constructor() {
        super(Artist);
    }

    async getArtist(artist_id, org_id) {
        return this.model.findOne({
            where: { artist_id, org_id, status: 1 }, // Retrieves an artist only if the artist's status is active(Not deleted) (status: 1).
            attributes: { exclude: ['id', 'updatedAt', 'status', 'org_id'] },
        });
    }

    async updateArtist(artist_id, org_id, data) {
        const response = await this.model.update(data, {
            where: { artist_id, org_id },
        });
        return response;
    }

    async getAllArtist(whereFilter, orderFilter, limit, offset) {
        const response = await this.model.findAll({
            where: whereFilter,
            order: orderFilter,
            limit,
            offset: (offset - 1) * limit,
            attributes: { exclude: ['id', 'updatedAt', 'status', 'org_id'] },
        })
        return response;
    }
}

module.exports = ArtistRepository;
