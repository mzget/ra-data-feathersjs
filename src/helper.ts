import debug from "debug";

export const dbg = debug("ra-data-feathers:rest-client");
export const queryOperators = [
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$ne",
  "$sort",
  "$or",
  "$nin",
  "$in",
];
export const defaultIdKey = "id";

export function flatten(object, prefix = "", stopKeys: Array<any> = []) {
  return Object.keys(object).reduce((prev, element) => {
    const hasNextLevel =
      object[element] &&
      typeof object[element] === "object" &&
      !Array.isArray(object[element]) &&
      !Object.keys(object[element]).some((key) => stopKeys.includes(key));
    return hasNextLevel
      ? {
          ...prev,
          ...flatten(object[element], `${prefix}${element}.`, stopKeys),
        }
      : { ...prev, ...{ [`${prefix}${element}`]: object[element] } };
  }, {});
}
