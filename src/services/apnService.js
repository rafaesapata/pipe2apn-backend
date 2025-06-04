import {
  PartnerCentralSellingClient,
  CreateOpportunityCommand,
  ListOpportunitiesCommand,
  AssociateOpportunityCommand,
  StartEngagementFromOpportunityTaskCommand,
} from "@aws-sdk/client-partnercentral-selling"; // ES Modules import
import { v4 as uuidv4 } from "uuid";
import config from "../config.js";
import { formatPhoneNumber } from "../utils/phoneUtils.js";


class ApnService {
  constructor() {
    this.client = new PartnerCentralSellingClient(config.apnCredentials);
  }

  async createOpportunity(opportunity) {
    const input = {
      // CreateOpportunityRequest
      Catalog: config.apnCatalog, // required
      PrimaryNeedsFromAws: [
        // PrimaryNeedsFromAws - Standard
        "Co-Sell - Pricing Assistance",
      ],
      NationalSecurity: "No",
      Customer: {
        // Customer
        Account: {
          // Account
          Industry: opportunity.orgIndustryVertical, // required
          OtherIndustry:
            opportunity.orgIndustryVertical === "Other"
              ? opportunity.orgIndustryVerticalOther
              : "",
          CompanyName: opportunity.orgName, // required
          WebsiteUrl: opportunity.website || opportunity.orgWebsite,
          Address: {
            // Address
            City: opportunity.orgCity,
            PostalCode: opportunity.orgPostalCode,
            StateOrRegion: opportunity.orgState,
            CountryCode: opportunity.orgCountry, // required
            StreetAddress: opportunity.orgAddress,
          },
        },
        Contacts: [
          // CustomerContactsList do cliente
          {
            // Contact
            Email: opportunity.personEmail,
            FirstName: opportunity.personFirstName,
            LastName: opportunity.personLastName,
            Phone: formatPhoneNumber(opportunity.personPhone),
          },
        ],
      },
      Project: {
        // Project
        DeliveryModels: [
          // DeliveryModels
          "Managed Services",
          "Professional Services",
        ],
        ExpectedCustomerSpend: [
          // ExpectedCustomerSpendList
          {
            // ExpectedCustomerSpend
            Amount: "833", // required
            CurrencyCode: "USD",
            Frequency: "Monthly", // required
            TargetCompany: opportunity.orgName, // required
          },
        ],
        Title: opportunity.title, // required
        CustomerBusinessProblem: opportunity.customerBusinessProblem, // required texto
        CustomerUseCase: opportunity.customerUseCase, // required select
        SalesActivities: [
          // SalesActivities
          "Initialized discussions with customer",
        ],
      },
      OpportunityType: "Net New Business", // required standard
      Marketing: {
        // Marketing
        Source: "Marketing Activity",
        AwsFundingUsed: "No",
      },
      ClientToken: uuidv4(), // Gerando UUID único para cada requisição
      LifeCycle: {
        // LifeCycle
        Stage: "Prospect",
        TargetCloseDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // Data atual + 120 dias
      },
      Origin: "Partner Referral", // standard
      OpportunityTeam: [
        // PartnerOpportunityTeamMembersList
        {
          Email: "lucas.neo@uds.com.br",
          FirstName: "Lucas",
          LastName: "Neo",
          BusinessTitle: "PartnerAccountManager",
          Phone: "+16315336650",
        },
      ],
    };

    console.log(JSON.stringify(input, null, 2));
    const command = new CreateOpportunityCommand(input);
    const response = await this.client.send(command);
    return response;
  }

  async listOpportunities() {
    const command = new ListOpportunitiesCommand({
      Catalog: config.apnCatalog,
      MaxResults: 100,
      LastModifiedDate: {
        AfterLastModifiedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        BeforeLastModifiedDate: new Date(),
      },
    });
    const response = await this.client.send(command);
    return response.OpportunitySummaries;
  }

  async addSolution(opportunityId, solutions) {
    try {
      const output = [];
      for (const solution of solutions) {
        const command = new AssociateOpportunityCommand({
          Catalog: config.apnCatalog,
          OpportunityIdentifier: opportunityId,
          RelatedEntityType: "Solutions",
          RelatedEntityIdentifier: solution,
        });
        const response = await this.client.send(command);
        output.push(response);
      }
      return output;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async submitOpportunity(opportunityId) {
    const command = new StartEngagementFromOpportunityTaskCommand({
      Catalog: config.apnCatalog,
      ClientToken: uuidv4(),
      Identifier: opportunityId,
      AwsSubmission: {
        InvolvementType: "Co-Sell",
        Visibility: "Full",
      },
    });
    const response = await this.client.send(command);
    return response;
  }
}

const apnService = new ApnService();

export default apnService;
