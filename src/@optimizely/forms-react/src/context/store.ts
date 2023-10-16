import { createContext, useContext } from 'react';
import { FormState } from '../models/FormContext';

export const FormContext = createContext<FormState | null>(null);

export const FormDispatchContext = createContext<any>(null);

export function useForms() {
  return useContext(FormContext);
}

export function useFormsDispatch() {
  return useContext(FormDispatchContext);
}