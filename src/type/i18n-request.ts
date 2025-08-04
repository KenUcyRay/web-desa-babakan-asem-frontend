import { Request } from "express";
import { TFunction } from "i18next";

export interface I18nRequest extends Request {
  t: TFunction;
}
