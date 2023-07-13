const { Router } = require('express');
const userRoute = require('./userRoute');

const router = Router();

router.use('/users', userRoute);


module.exports = router;