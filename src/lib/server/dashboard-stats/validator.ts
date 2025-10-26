import Joi from "joi";
import { IDashboardStatsFilters } from "./interface";

class DashboardStatsValidator {
  public getDashboardStats(filters: IDashboardStatsFilters) {
    const schema = Joi.object({
      startDate: Joi.date().optional().messages({
        "date.base": "Start date must be a valid date",
      }),
      endDate: Joi.date().optional().messages({
        "date.base": "End date must be a valid date",
      }),
      period: Joi.string()
        .valid("day", "week", "month", "year", "all")
        .optional()
        .messages({
          "any.only": "Period must be one of: day, week, month, year, all",
        }),
      roomStatus: Joi.array()
        .items(Joi.string())
        .optional()
        .messages({
          "array.base": "Room status must be an array of strings",
        }),
      staffStatus: Joi.array()
        .items(Joi.string())
        .optional()
        .messages({
          "array.base": "Staff status must be an array of strings",
        }),
      stayStatus: Joi.array()
        .items(Joi.string())
        .optional()
        .messages({
          "array.base": "Stay status must be an array of strings",
        }),
      housekeepingStatus: Joi.array()
        .items(Joi.string())
        .optional()
        .messages({
          "array.base": "Housekeeping status must be an array of strings",
        }),
    });

    return schema.validate(filters);
  }

  public validateDateRange(startDate?: Date, endDate?: Date) {
    if (startDate && endDate && startDate > endDate) {
      return {
        error: "Start date cannot be after end date",
      };
    }
    return null;
  }
}

export const dashboardStatsValidator = new DashboardStatsValidator();
