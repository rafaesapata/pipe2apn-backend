import pipedriveService from "../services/pipedriveService.js";

class PipedriveController {
  async getDeals(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        lastUpdateStartDate: req.query.lastUpdateStartDate,
        lastUpdateEndDate: req.query.lastUpdateEndDate,
        filterId: req.query.filterId,
      };

      const deals = await pipedriveService.getDeals(filters);
      res.json(deals);
    } catch (error) {
      console.error("Erro ao buscar deals:", error);
      res.status(500).json({
        error: "Erro ao buscar deals",
        message: error.message,
      });
    }
  }

  async insertSuccessTag(req, res, next) {
    try {
      const dealId = req.params.id;
      const { data } = await pipedriveService.insertSuccessTag(dealId);
      res.json(data).status(200);
    } catch (error) {
      console.error("Erro ao inserir tag:", error);
      res.status(500).json({
        error: "Erro ao inserir tag",
        message: error.message,
      });
    }
  }
}

export default new PipedriveController();
