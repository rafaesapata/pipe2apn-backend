import segmento from '../../segmento.json' with { type: "json" };

export const getSegment = (id) => {
    if (!id) return null;
    
    const segment = segmento.find(segment => segment.id == id);
    return segment ? segment.label : 'Update Segment Relation File';
};

export const getIndustryVertical = (id) => {
    if (!id) return null;

    const industryVertical = segmento.find(industryVertical => industryVertical.id == id);
    return industryVertical ?   industryVertical.industryVertical : null;
};

