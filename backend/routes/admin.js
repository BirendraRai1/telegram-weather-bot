const express = require('express');
const router = express.Router();
const {getUsers,blockUnblockUser,deleteUser,getSettings,updateSetting} = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');

router.get('/users/:password', authenticate, getUsers);
router.post('/users/:password/:id/blockUnblock', authenticate, blockUnblockUser);
router.get('/settings/:password', authenticate, getSettings);
router.put('/settings/:password', authenticate, updateSetting);

module.exports = router;