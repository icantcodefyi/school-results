import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the types for our form data
type FormState = {
  formFields: Record<string, string>;
  setFormField: (fieldName: string, value: string) => void;
  setMultipleFields: (fields: Record<string, string>) => void;
  resetForm: () => void;
};

// Create the store with persistence
export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      formFields: {},
      
      // Set a single form field
      setFormField: (fieldName, value) => 
        set((state) => ({
          formFields: {
            ...state.formFields,
            [fieldName]: value,
          },
        })),
      
      // Set multiple form fields at once
      setMultipleFields: (fields) => 
        set((state) => ({
          formFields: {
            ...state.formFields,
            ...fields,
          },
        })),
      
      // Reset the form to empty state
      resetForm: () => set({ formFields: {} }),
    }),
    {
      name: 'playgroup-results-form-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
); 