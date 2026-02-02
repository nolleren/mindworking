import * as yup from 'yup';

export const cvSchema = yup.object({
  name: yup
    .string()
    .required('Navn er påkrævet')
    .min(2, 'Navn skal være mindst 2 tegn')
    .max(200, 'Navn må højst være 200 tegn'),
});

export type CvFormData = yup.InferType<typeof cvSchema>;
