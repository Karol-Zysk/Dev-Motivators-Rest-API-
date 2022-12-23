import { object } from "zod";
import { string, TypeOf } from "zod/lib";

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }).max(40, "Title must have less than or equal 40 characters"),
    subtitle: string({
      required_error: "Subtitle is required",
    }).max(999, "Title must have less than or equal 999 characters"),
    photo: string({
      required_error: "Image is required",
    }),
  }),
};

const params = {
  params: object({
    devMotivatorId: string({
      required_error: "Id is required",
    }),
  }),
};

export const createMotivatorSchema = object({
  ...payload,
});

export type CreateMotivatorInput = TypeOf<typeof createMotivatorSchema>;
