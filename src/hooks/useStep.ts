import { useState } from 'react';

export default function useStep(totalStep?: number) {
  const [step, setStep] = useState({
    currentStep: 1,
    completeStep: 0,
    totalStep: totalStep || 3,
  });

  const hasNextStep = step.currentStep < step.totalStep;
  const hasPreviousStep = step.currentStep > 1;

  const canGoToNextStep = step.completeStep > step.currentStep && hasNextStep;
  const canGoToPreviousStep = hasPreviousStep;

  const stepController = {
    nextStep: () => {
      setStep((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
      }));
    },

    prevStep: () => {
      setStep((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    },

    completeStep: () => {
      setStep((prev) => ({
        ...prev,
        completeStep: prev.currentStep,
      }));
    },

    resetStep: () => {
      setStep((prev) => ({ ...prev, completeStep: 0, currentStep: 1 }));
    },

    directToStep: (step: number) => {
      setStep((prew) => ({
        ...prew,
        currentStep: step,
        completeStep: step - 1,
      }));
    },
  };

  return {
    currentStep: step.currentStep,
    completeStep: step.completeStep,
    totalStep: step.totalStep,
    stepController,
    hasNextStep,
    hasPreviousStep,
    canGoToNextStep,
    canGoToPreviousStep,
  };
}

export type StepControllerType = {
  nextStep: () => void;
  prevStep: () => void;
  completeStep: () => void;
  resetStep: () => void;
  directToStep: (step: number) => void;
};
