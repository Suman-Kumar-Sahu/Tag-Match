import express from 'express'
import multer from 'multer';
import { atsCheker } from '../controllers/atsControllers.js';
import { chatWithAi } from '../utils/chatGpt.js'

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
}); 

router.post('/analyze', upload.single('resume'), atsCheker);
router.post('/ai-analyze', chatWithAi);

export default router