import ReminderViewModel from "../models/ReminderViewModel";
import { Validator } from "fluentvalidation-ts";

class ReminderValidator extends Validator<ReminderViewModel> {
  constructor() {
    super();

    this.ruleFor("content").notNull().withMessage("Content is required");
    this.ruleFor("content").notEmpty().withMessage("Content is required");

    this.ruleFor("email").notEmpty().notNull().withMessage("email is required");

    this.ruleFor("utcOffset")
      .notNull()
      .greaterThanOrEqualTo(-11)
      .lessThanOrEqualTo(12)
      .withMessage("offset is required and must be between -11 and +12");

    this.ruleFor("dueDateUtc").notNull().withMessage("dueDate must be defined");
    this.ruleFor("dueDateTime")
      .notNull()
      .notEmpty()
      .withMessage("dueDateTime must be defined");

    this.ruleFor("dueDateAlert")
      .notNull()
      .withMessage("dueDateAlert must be defined");
  }
}

export default ReminderValidator;
