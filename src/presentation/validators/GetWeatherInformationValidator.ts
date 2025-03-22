import { z } from "zod";

import { zodValidateRequest } from "../../utils/helpers/zod-validate-request";

export const query = z
  .object({
    id: z
      .string()
      .optional()
      .transform((value) => (value ? parseInt(value) : null))
      .optional(),
    name: z.string().optional(),
  })
  .refine((data) => data.id || data.name, {
    message: "Either 'id' or 'name' must be provided, but not both",
  });

export type GetWeatherInformationParams = z.infer<typeof query>;

export const GetWeatherInformationValidator = zodValidateRequest({ query });
