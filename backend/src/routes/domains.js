const express = require('express');
const controller = require('../controllers/domainController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
