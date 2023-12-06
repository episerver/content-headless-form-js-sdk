import { createContext, useContext } from 'react';
import { FormState } from '@episerver/forms-sdk';

export const FormContext = createContext<FormState | null>(null);

export const FormDispatchContext = createContext<any>(null);

export function useForms() {
  return useContext(FormContext);
}

export function useFormsDispatch() {
  return useContext(FormDispatchContext);
}