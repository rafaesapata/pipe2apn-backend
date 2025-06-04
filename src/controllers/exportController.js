import exportService from "../services/exportService.js";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

class ExportController {
  async exportSelectedItems(req, res, next) {
    try {
      const { selectedItems, filters } = req.body;

      if (
        !selectedItems ||
        !Array.isArray(selectedItems) ||
        selectedItems.length === 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Nenhum item selecionado para exportação.",
          });
      }

      // Preparar os dados para exportação
      const dataToExport = exportService.prepareDataForExport(selectedItems);

      // Definir o caminho para o arquivo Excel de saída
      const outputExcelPath = path.join(
        "/tmp",
        `exported_opportunities_${Date.now()}.xlsx`
      );

      // Criar um novo workbook Excel usando ExcelJS
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "Excel Opportunity Import Templa"
      );

      // Obter os cabeçalhos das colunas do primeiro objeto
      if (dataToExport.length > 0) {
        const headers = Object.keys(dataToExport[0]);

        // Adicionar cabeçalhos
        worksheet.columns = headers.map((header) => ({
          header: header,
          key: header,
          width: 30, // Largura padrão para melhor visualização
        }));

        // Adicionar dados
        dataToExport.forEach((row) => {
          worksheet.addRow(row);
        });

        // Estilizar cabeçalhos (opcional)
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE0E0E0" },
        };
      }

      // Salvar o arquivo Excel
      await workbook.xlsx.writeFile(outputExcelPath);

      // Verificar se o arquivo Excel foi criado
      if (!fs.existsSync(outputExcelPath)) {
        return res
          .status(500)
          .json({ success: false, message: "Arquivo Excel não foi gerado." });
      }

      // Enviar o arquivo Excel como resposta
      res.download(
        outputExcelPath,
        "Opportunity_Import_Template_Filled.xlsx",
        (err) => {
          if (err) {
            console.error("Erro ao enviar arquivo:", err);
            return res
              .status(500)
              .json({ success: false, message: "Erro ao enviar arquivo." });
          }

          // Limpar o arquivo Excel após o envio
          try {
            fs.unlinkSync(outputExcelPath);
          } catch (err) {
            console.error("Erro ao remover arquivo Excel temporário:", err);
          }
        }
      );
    } catch (error) {
      console.error("Erro ao exportar itens:", error);
      res
        .status(500)
        .json({
          success: false,
          message: `Erro ao exportar itens: ${error.message}`,
        });
    }
  }
}

const exportController = new ExportController();

export default exportController;
