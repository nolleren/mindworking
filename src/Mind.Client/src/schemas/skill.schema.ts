import * as yup from 'yup';

export const skillSchema = yup.object({
  name: yup.string().required('Navn er påkrævet').max(200, 'Navn må højst være 200 tegn'),
  description: yup.string().required('Beskrivelse er påkrævet'),
  levelOfMastery: yup
    .string()
    .oneOf(['BASIS', 'MEDIUM', 'STRONG', 'EVANGELIST'], 'Ugyldigt niveau')
    .required('Niveau er påkrævet'),
});

export type SkillFormData = yup.InferType<typeof skillSchema>;
