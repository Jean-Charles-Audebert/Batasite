import express from 'express';
import * as contentController from '../controllers/contentController.js';

const router = express.Router();

router.get('/client/:clientId', contentController.getContentByClient);
router.get('/:id', contentController.getContent);
router.post('/', contentController.createContent);
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

export default router;
