import * as yup from 'yup';

export const projectSchema = yup.object({
  name: yup.string().required('Navn er påkrævet').max(200, 'Navn må højst være 200 tegn'),
  startDate: yup
    .string()
    .required('Startdato er påkrævet')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ugyldig dato'),
  endDate: yup
    .string()
    .required('Slutdato er påkrævet')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ugyldig dato')
    .test('end-after-start', 'Slutdato skal være efter startdato', function (value) {
      const startDate = this.parent?.startDate as string | undefined;
      if (!value || !startDate) return true;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return true;

      // ISO 8601 date strings compare lexicographically
      return value >= startDate;
    }),
  description: yup.string().required('Beskrivelse er påkrævet'),
});

export type ProjectFormData = yup.InferType<typeof projectSchema>;
