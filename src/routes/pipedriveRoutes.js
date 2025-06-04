import { Router } from 'express';
import pipedriveController from '../controllers/pipedriveController.js';

const pipedriveRoutes = Router();

pipedriveRoutes.get('/deals', pipedriveController.getDeals);
pipedriveRoutes.put('/deals/add-tag/:id', pipedriveController.insertSuccessTag);

export default pipedriveRoutes;


