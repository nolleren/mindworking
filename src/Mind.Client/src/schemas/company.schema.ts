import * as yup from 'yup';

export const companySchema = yup.object({
  name: yup.string().required('Navn er påkrævet').max(200, 'Navn må højst være 200 tegn'),
  address: yup.string().required('Adresse er påkrævet').max(500, 'Adresse må højst være 500 tegn'),
  zipCode: yup
    .string()
    .required('Postnummer er påkrævet')
    .max(20, 'Postnummer må højst være 20 tegn'),
  city: yup.string().required('By er påkrævet').max(100, 'By må højst være 100 tegn'),
  description: yup.string().required('Beskrivelse er påkrævet'),
});

export type CompanyFormData = yup.InferType<typeof companySchema>;
