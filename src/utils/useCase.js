import useCases from '../../useCase.json' with { type: "json" };

export const getUseCase = (useCaseId) => {
    if (!useCaseId) {
        return null;
    }

    const useCase = useCases.find((useCase) => useCase.id == useCaseId);
    return useCase.label;
}

export const getUseCaseServices = (useCaseId) => {
    if (!useCaseId) {
        return null;
    }

    const useCase = useCases.find((useCase) => useCase.id == useCaseId);
    return useCase.services;
}

