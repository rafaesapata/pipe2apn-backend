/**
 * Formata um número de telefone para o padrão E.164 (+[1-9][0-9]{1,14})
 * @param {string} phoneNumber - O número de telefone a ser formatado
 * @returns {string} O número formatado no padrão E.164
 */
export function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    
    // Remove todos os caracteres não numéricos exceto o '+'
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Adiciona o '+' se não estiver presente
    if (!cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
    }
    
    // Verifica se o número está no formato correto
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(cleaned)) {
        throw new Error('Número de telefone inválido. Deve seguir o formato E.164 (+[1-9][0-9]{1,14})');
    }
    
    return cleaned;
} 