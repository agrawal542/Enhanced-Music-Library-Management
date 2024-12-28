const express = require('express');
const { InfoController } = require('../../controllers');
const userRoutes = require('./user-routes')
const artistRoutes = require('./artist-routes')


const router = express.Router();

router.use('/users', userRoutes);
router.use('/artists', artistRoutes);


router.get('/info', InfoController.info);



module.exports = router