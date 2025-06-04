import { format } from 'date-fns';

// Esta função auxiliará a obter o primeiro nome e o sobrenome
const parseFullName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') {
        return { firstName: '', lastName: '' };
    }
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
    return { firstName, lastName };
};

class ExportService {
    prepareDataForExport(pipedriveItems) {
        const exportedData = [];
        const today = new Date();
        // Cria uma nova data para não modificar 'today' nas iterações subsequentes do cálculo de targetCloseDateDefault
        const baseDateForDefaultClose = new Date(today);
        const targetCloseDateDefault = format(new Date(baseDateForDefaultClose.setMonth(baseDateForDefaultClose.getMonth() + 3)), 'MM/dd/yyyy');
    
        const templateHeaders = [
            'Customer Company Name - required',
            'Industry Vertical - required',
            'Industry Other - required if Industry Vertical = Other',
            'Does opportunity belong to NatSec? - required if Industry Vertical = Government',
            'Country - required',
            'State/Province - required if Country = United States',
            'Postal Code - required',
            'Website - required',
            'Partner Primary Need from AWS - required',
            'Partner Project Title - required',
            'Customer Business Problem - required',
            'Solution Offered - required',
            'Other Solution Offered - required if Solution Offered = Other',
            'Next Steps - applicable if Partner Primary Need from AWS = Co-Sell',
            'Use Case - required',
            'Estimated AWS Monthly Recurring Revenue - required',
            'Target Close Date(mm/dd/yyyy) - required',
            'Opportunity Type - required',
            'Delivery Model - required',
            'Is Opportunity from Marketing Activity? - required',
            'Was Marketing Development Funds Used? - required if Is Opportunity from Marketing Activity? = Yes',
            'Customer DUNS',
            'Sales Activities - required if Partner Primary Need from AWS = Co-Sell',
            'AWS Products',
            'Parent Opportunity ID (applicable only if Opportunity Type = Flat Renewal or Expansion)',
            'Customer First Name',
            'Customer Last Name',
            'Customer Title',
            'Customer Phone',
            'Customer Email',
            'AWS Account ID',
            'Additional Comments',
            'Street Address',
            'City',
            'Competitive Tracking',
            'Other Competitors - required if Competitive Tracking = *Other',
            'Marketing Campaign (applicable only if Is Opportunity from Marketing Activity? = Yes)',
            'Marketing Activity Channel (applicable only if Is Opportunity from Marketing Activity? = Yes)',
            'Marketing Activity Use-Case (applicable only if Is Opportunity from Marketing Activity? = Yes)',
            'APN Programs',
            'Primary Sales Contact First Name',
            'Primary Sales Contact Last Name',
            'Primary Sales Contact Phone',
            'Primary Sales Contact Email',
            'Primary Contact Title',
            'Partner CRM Unique Identifier'
        ];
    
        for (const item of pipedriveItems) {
            const customerContact = parseFullName(item.personName);
            const salesContact = parseFullName(item.ownerName);
    
            let estimatedMRR = 1000; 
            if (item.value) {
                const numericValue = parseFloat(item.value);
                if (!isNaN(numericValue)) {
                    if (item.currency === 'USD') {
                        estimatedMRR = Math.round(numericValue / 12); 
                    } else if (item.currency === 'BRL') {
                        // Usar a taxa de conversão do .env ou o valor padrão 5.60
                        const brlToUsdRate = process.env.PIP2APN_BRL_TO_USD_RATE ? parseFloat(process.env.PIP2APN_BRL_TO_USD_RATE) : 5.60;
                        estimatedMRR = Math.round((numericValue / brlToUsdRate) / 12); 
                    }
                    estimatedMRR = Math.max(0, estimatedMRR);
                } else {
                     estimatedMRR = 1000; // Default if value is not a number
                }
            } else {
                estimatedMRR = 1000; // Default if value is null/undefined
            }
            
            let itemTargetCloseDate = targetCloseDateDefault;
            if (item.expected_close_date) {
                try {
                    const parsedDate = new Date(item.expected_close_date);
                    if (!isNaN(parsedDate.getTime())) {
                        itemTargetCloseDate = format(parsedDate, 'MM/dd/yyyy');
                    }
                } catch (e) {
                    // Mantém o default se a data for inválida
                }
            }
    
            const mappedRow = {
                'Customer Company Name - required': item.orgName || 'N/A',
                'Industry Vertical - required': item.orgIndustryVertical || '',
                'Industry Other - required if Industry Vertical = Other': '',
                'Does opportunity belong to NatSec? - required if Industry Vertical = Government': 'No',
                'Country - required': 'Brazil',
                'State/Province - required if Country = United States': '',
                'Postal Code - required': item.orgPostalCode || '00000-000',
                'Website - required': (item.website || item.orgWebsite) || '',
                'Partner Primary Need from AWS - required': 'Co-Sell',
                'Partner Project Title - required': item.title || 'N/A',
                'Customer Business Problem - required': 'Necessidade de otimização de processos e infraestrutura em nuvem.',
                'Solution Offered - required': 'AWS Cloud Solutions',
                'Other Solution Offered - required if Solution Offered = Other': '',
                'Next Steps - applicable if Partner Primary Need from AWS = Co-Sell': 'Agendar reunião de acompanhamento.',
                'Use Case - required': 'General Infrastructure Modernization',
                'Estimated AWS Monthly Recurring Revenue - required': estimatedMRR,
                'Target Close Date(mm/dd/yyyy) - required': itemTargetCloseDate,
                'Opportunity Type - required': 'New Business',
                'Delivery Model - required': 'Partner Delivered',
                'Is Opportunity from Marketing Activity? - required': 'No',
                'Was Marketing Development Funds Used? - required if Is Opportunity from Marketing Activity? = Yes': '',
                'Customer DUNS': '',
                'Sales Activities - required if Partner Primary Need from AWS = Co-Sell': 'Qualificação inicial, Demonstração, Proposta enviada.',
                'AWS Products': (item.tags && Array.isArray(item.tags) && item.tags.map(t=>String(t).toLowerCase()).includes('ec2')) ? 'Amazon EC2' : '',
                'Parent Opportunity ID (applicable only if Opportunity Type = Flat Renewal or Expansion)': '',
                'Customer First Name': customerContact.firstName || 'N/A',
                'Customer Last Name': customerContact.lastName || 'N/A',
                'Customer Title': '',
                'Customer Phone': '',
                'Customer Email': '',
                'AWS Account ID': '',
                'Additional Comments': '',
                'Street Address': item.orgAddress || '',
                'City': item.orgCity || '',
                'Competitive Tracking': 'No Competition Identified',
                'Other Competitors - required if Competitive Tracking = *Other': '',
                'Marketing Campaign (applicable only if Is Opportunity from Marketing Activity? = Yes)': '',
                'Marketing Activity Channel (applicable only if Is Opportunity from Marketing Activity? = Yes)': '',
                'Marketing Activity Use-Case (applicable only if Is Opportunity from Marketing Activity? = Yes)': '',
                'APN Programs': '',
                'Primary Sales Contact First Name': salesContact.firstName || '',
                'Primary Sales Contact Last Name': salesContact.lastName || '',
                'Primary Sales Contact Phone': '(00) 00000-0000',
                'Primary Sales Contact Email': 'vendedor@partner.com',
                'Primary Contact Title': 'Sales Representative',
                'Partner CRM Unique Identifier': String(item.id)
            };
            exportedData.push(mappedRow);
        }
        return exportedData;
    }
}

const exportService = new ExportService();

export default exportService;

