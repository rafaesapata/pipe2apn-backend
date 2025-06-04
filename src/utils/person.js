export const getPersonEmail = (person) => {
    if (person.email.length <= 0) {
        return null;
    }

    const sortedEmails = person.email.sort((a, b) => a.primary ? -1 : b.primary ? 1 : 0);

    return sortedEmails[0].value;
}

export const getPersonPhone = (person) => {
    if (person.phone.length <= 0) {
        return null;
    }
    
    const sortedPhones = person.phone.sort((a, b) => a.primary ? -1 : b.primary ? 1 : 0);

    return sortedPhones[0].value;
}

export const getPersonFirstName = (person) => {
    if (person.name.length <= 0) {
        return null;
    }

    return person.name.split(' ')[0];
}

export const getPersonLastName = (person) => {
    if (person.name.length <= 0) {
        return null;
    }

    return person.name.split(' ').slice(1).join(' ');
}
