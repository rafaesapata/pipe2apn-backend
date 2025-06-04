import { Router } from "express";
import apnController from "../controllers/apnController.js";

const apnRoutes = Router();


apnRoutes.post('/', apnController.createOpportunity);
apnRoutes.get('/', apnController.listOpportunities);
apnRoutes.post('/add-solution', apnController.addSolution);
apnRoutes.post('/submit-opportunity', apnController.submitOpportunity);

export default apnRoutes;
