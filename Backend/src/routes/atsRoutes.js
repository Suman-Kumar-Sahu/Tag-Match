import express from 'express'
import multer from 'multer';
import { atsCheker } from '../controllers/atsControllers.js';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
 }); 

router.post('/analyze', upload.single('resume'),atsCheker);

export default router