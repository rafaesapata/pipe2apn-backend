import apnService from "../services/apnService.js";
import pipedriveService from "../services/pipedriveService.js";

class ApnController {
  async createOpportunity(req, res, next) {
    try {
      console.log("req.body", req.body);
      const opportunities = req.body.opportunities;

      const output = [];
      for (const opportunity of opportunities) {
        const opportunityData = {
          pipedriveId: opportunity.id,
        }

        const response = await apnService.createOpportunity(opportunity);
        opportunityData.apnId = response.Id;
        
        // Add solution to opportunity
        const solutionResponse = await apnService.addSolution(response.Id, opportunity.services);
        opportunityData.solutionResponse = solutionResponse

        // Submit opportunity
        const submitResponse = await apnService.submitOpportunity(response.Id);
        opportunityData.submitResponse = submitResponse

        // Add tags to opportunity
        const tagResponse = await pipedriveService.insertSuccessTag(opportunity.id);
        opportunityData.tagResponse = tagResponse

        output.push(opportunityData);
      }

      res.status(201).json({ message: "Opportunities created successfully", output });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: error.message });
    }
  }

  async listOpportunities(req, res, next) {
    try {
      const opportunities = await apnService.listOpportunities();
      res.status(200).json(opportunities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addSolution(req, res, next) {
    try {
      const { opportunityId, solution } = req.body;
      const response = await apnService.addSolution(opportunityId, solution);
      res.status(200).json({ message: "Solution added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async submitOpportunity(req, res, next) {
    try {
      const { opportunityId } = req.body;
      const response = await apnService.submitOpportunity(opportunityId);
      if (response.TaskStatus === 'COMPLETE') {
        res.status(200).json({ message: "Opportunity submitted successfully" });
      } else {
        res.status(400).json(response)
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

const apnController = new ApnController();

export default apnController;
