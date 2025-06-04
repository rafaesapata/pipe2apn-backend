import pkg from "pipedrive/v1";
const { Configuration, DealsApi, DealFieldsApi, OrganizationsApi } = pkg;
import config from "../config.js";
import { getSegment, getIndustryVertical } from "../utils/segment.js";
import {
  getPersonEmail,
  getPersonPhone,
  getPersonFirstName,
  getPersonLastName,
} from "../utils/person.js";
import { getUseCase, getUseCaseServices } from "../utils/useCase.js";
import axios from "axios";
import { getCountryCode } from "../utils/country.js";
const STANDARD_DEALS_FILTER_ID = 384;

class PipedriveService {
  constructor() {
    this.apiConfig = new Configuration({
      apiKey: config.pipedriveApiKey,
    });
    this.baseUrl = "https://api.pipedrive.com/v1";
  }

  getPipedriveApiClient(ApiConstructor) {
    return new ApiConstructor(this.apiConfig);
  }

  async getDeals(filters = {}) {
    try {
      const dealsApi = this.getPipedriveApiClient(DealsApi);
      const organizationsApi = this.getPipedriveApiClient(OrganizationsApi);

      let allDeals = [];
      let start = 0;
      const limit = 100;
      let moreItemsInCollection = true;

      const filterIdToUse = filters.filterId
        ? Number(filters.filterId)
        : STANDARD_DEALS_FILTER_ID;

      while (moreItemsInCollection) {
        const response = await dealsApi.getDeals({
          start: start,
          limit: limit,
          filter_id: filterIdToUse,
        });
        if (response && response.data && response.data.length > 0) {
          allDeals = allDeals.concat(response.data);
          if (
            response.additional_data &&
            response.additional_data.pagination &&
            response.additional_data.pagination.more_items_in_collection ===
              false
          ) {
            moreItemsInCollection = false;
          } else {
            start += limit;
          }
        } else {
          moreItemsInCollection = false;
        }
      }

      const { startDate, endDate, lastUpdateStartDate, lastUpdateEndDate } =
        filters;

      const filteredDeals = allDeals.filter((deal) => {
        let matchesFilters = true;

        if (startDate && startDate.trim() !== "" && deal.add_time) {
          if (new Date(deal.add_time) < new Date(startDate))
            matchesFilters = false;
        }
        if (endDate && endDate.trim() !== "" && deal.add_time) {
          if (new Date(deal.add_time) > new Date(endDate))
            matchesFilters = false;
        }

        if (
          lastUpdateStartDate &&
          lastUpdateStartDate.trim() !== "" &&
          deal.update_time
        ) {
          if (new Date(deal.update_time) < new Date(lastUpdateStartDate))
            matchesFilters = false;
        }
        if (
          lastUpdateEndDate &&
          lastUpdateEndDate.trim() !== "" &&
          deal.update_time
        ) {
          if (new Date(deal.update_time) > new Date(lastUpdateEndDate))
            matchesFilters = false;
        }

        return matchesFilters;
      });

      const enrichedDeals = await Promise.all(
        filteredDeals.map(async (deal) => {
          let organizationData = null;

          if (deal.org_id && deal.org_id.value) {
            try {
              const orgResponse = await organizationsApi.getOrganization({
                id: deal.org_id.value,
              });
              if (orgResponse && orgResponse.data) {
                organizationData = orgResponse.data;
              }
            } catch (error) {
              console.error(
                `Erro ao buscar detalhes da organização ${deal.org_id.value}:`,
                error.message
              );
            }
          }

          return {
            id: deal.id,
            title: deal.title,
            type: "deal",
            value: deal.value,
            currency: deal.currency,
            ownerName:
              deal.owner_name || (deal.user_id ? deal.user_id.name : "N/A"),
            status: deal.status || "N/A",
            tags:
              deal.tags ||
              (deal.label ? deal.label.split(",").map((t) => t.trim()) : []),
            orgName:
              deal.org_name ||
              (organizationData ? organizationData.name : "N/A"),
            orgAddress: organizationData ? organizationData.address : null,
            orgPeopleCount: organizationData
              ? organizationData.people_count
              : null,
            personFirstName: deal.person_id
              ? getPersonFirstName(deal.person_id)
              : null,
            personLastName: deal.person_id
              ? getPersonLastName(deal.person_id)
              : null,
            personEmail: deal.person_id ? getPersonEmail(deal.person_id) : null,
            personPhone: deal.person_id ? getPersonPhone(deal.person_id) : null,
            creationDate: deal.add_time,
            lastUpdateDate: deal.update_time,
            addTime: deal.add_time,
            updateTime: deal.update_time,
            website:
              deal["3ea56a67300536607ed6cc7d5df9789b2cede92f"] ||
              organizationData
                ? organizationData[
                    "3109508f79849a75777c68cea1e0fc068ed96047"
                  ] || null
                : null,
            orgOwnerName: organizationData
              ? organizationData.owner_name ||
                (organizationData.owner_id
                  ? organizationData.owner_id.name
                  : null)
              : null,
            orgOpenDealsCount: organizationData
              ? organizationData.open_deals_count
              : null,
            orgClosedDealsCount: organizationData
              ? organizationData.closed_deals_count
              : null,
            orgAddTime: organizationData ? organizationData.add_time : null,
            orgUpdateTime: organizationData
              ? organizationData.update_time
              : null,
            orgSegment: organizationData
              ? getSegment(
                  organizationData["d6ecf2d05cafaa1b31dffd11036a62b33fb8118a"]
                )
              : null,
            orgIndustryVertical: organizationData
              ? getIndustryVertical(
                  organizationData["d6ecf2d05cafaa1b31dffd11036a62b33fb8118a"]
                )
              : null,
            orgCity: organizationData
              ? organizationData.address_locality || null
              : null,
            orgCountry: organizationData
              ? getCountryCode(organizationData.address_country) || null
              : null,
            orgPostalCode: organizationData
              ? organizationData.address_postal_code ||
                null ||
                organizationData["2140501d9ab957ae9ac908782bc6dab5dd16d7ee"]
              : null,
            probability: deal.probability,
            expectedCloseDate: deal.expected_close_date,
            stageId: deal.stage_id,
            pipelineId: deal.pipeline_id,
            activitiesCount: deal.activities_count,
            doneActivitiesCount: deal.done_activities_count,
            undoneActivitiesCount: deal.undone_activities_count,
            wonTime: deal.won_time,
            lostTime: deal.lost_time,
            firstWonTime: deal.first_won_time,
            closeTime: deal.close_time,
            customerUseCase:
              getUseCase(deal["741fa001fa02e75817e07484aaeec9a1bcaca0a2"]) ||
              null,
            customerBusinessProblem:
              deal["632bc883b803f4bd45818d5ebf91fa288a8efb12"] || null,
            services:
              getUseCaseServices(
                deal["741fa001fa02e75817e07484aaeec9a1bcaca0a2"]
              ) || null,
          };
        })
      );

      return enrichedDeals;
    } catch (error) {
      console.error("Erro ao buscar deals:", error.message);
      if (error.context) {
        console.error("Detalhes do erro Pipedrive:", error.context.body);
      }
      throw error;
    }
  }

  async getDealFields() {
    try {
      const dealFieldsApi = this.getPipedriveApiClient(DealFieldsApi);
      const response = await dealFieldsApi.getDealFields();
      if (response && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar DealFields do Pipedrive:", error.message);
      if (error.context) {
        console.error("Detalhes do erro Pipedrive:", error.context.body);
      }
      throw new Error("Falha ao buscar campos de negócios do Pipedrive.");
    }
  }

  async updateDeal(dealId, payload) {
    const response = await axios.put(
      `${this.baseUrl}/deals/${dealId}`,
      payload,
      { params: { api_token: config.pipedriveApiKey } }
    );

    return response;
  }

  async insertSuccessTag(dealId) {
    try {
      const dealsApi = this.getPipedriveApiClient(DealsApi);

      const { data: deal } = await dealsApi.getDeal({ id: dealId });

      const integratedAPNLabelId = 552;

      const labels = deal.label
        ? deal.label.split(",").map((t) => t.trim())
        : [];

      labels.push(integratedAPNLabelId);
      const labelIds = labels.map((label) => Number(label));

      const response = await this.updateDeal(dealId, { label: labelIds });

      return response;
    } catch (error) {
      console.error("Erro ao inserir tag:", error);
      throw error;
    }
  }
}

const pipedriveService = new PipedriveService();

export default pipedriveService;
