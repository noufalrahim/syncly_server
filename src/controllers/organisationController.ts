import BaseController from "./base/BaseController";
import { organisationModel } from "../models";
import { organisation } from "../db/schema";

// const joinConstraints: JoinType[] = [
//     {
//         table: admissionCriteria,
//         on: (admission, admissionCriteria) =>
//             eq(admission.id, admissionCriteria.admissionId)
//     }
// ];

export const organisationController = new BaseController(organisationModel, organisation
    // , joinCon as JoinType[]
);
