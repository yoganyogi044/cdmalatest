/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class BirthCert extends Contract {
  async initLedger(ctx) {
    console.info("============= START : Initialize Ledger ===========");
    console.info("============= END : Initialize Ledger ===========");
  }

  async createBirthCert(
    ctx,
    BIRTH_ID,
    id,
    TS_DATE_OF_BIRTH,
    I_ULBOBJID,
    VC_SEX,
    VC_SURNAMECHILD,
    VC_NAME_CHILD,
    VC_AADHAR_NO,
    VC_SURNAME_FATHER,
    VC_NAME_FATHER,
    VC_AADHAR_NO_FATHER,
    VC_SURNAME_MOTHER,
    VC_NAME_MOTHER,
    VC_AADHAR_NO_MOTHER,
    VC_PLACE_OF_BIRTH,
    I_HOSPITAL_ID,
    VC_ADDRESS_LINE_1,
    VC_ADDRESS_LINE_2,
    VC_ADDRESS_LINE_3,
    VC_PIN_CODE,
    VC_ADDRESS_PARENT,
    VC_PERMANENT_ADDRESS_PARENT,
    VC_INFORMANT_SURNAME,
    VC_INFORMANT_NAME,
    VC_INFORMANT_ADDRESS,
    TS_INFORMED_DATE,
    VC_INFORMANT_SIGN,
    VC_INFORMANT_REMARKS,
    VC_MOBILE_NUMBER,
    VC_EMAIL_ID,
    VC_RESIDENCE,
    VC_NAME_TOWN,
    VC_NAME_MANDAL,
    VC_NAME_DISTRICT,
    VC_NAME_STATE,
    VC_RELIGION,
    VC_FATHER_LITERACY,
    VC_MOTHER_LITERACY,
    VC_FATHER_OCCUPATION,
    VC_MOTHER_OCCUPATION,
    VC_AGE_MOTHER,
    VC_AGE_MOTHER_DELIVERY,
    VC_NO_CHILD,
    VC_MEDICAL_ATTENTION,
    VC_DELIVERY_TYPE,
    VC_PREGNANCY_DURATION,
    VC_AFFIDAVIT,
    VC_NONAVAILABILITY,
    VC_MAGISTRATE_ORDER,
    VC_REMARKS,
    C_DELFLAG,
    TS_DTTM,
    I_CERATED_BY_ID,
    TS_CREATED_TIME,
    I_MODIFIED_BY_ID,
    TS_MODIFIED_TIME,
    VC_CREATED_IP,
    VC_MODIFIED_IP,
    I_APP_RECEIVED_ID,
    VC_STATUS,
    VC_MC_REMARKS,
    VC_ULB_VERIFIED,
    VC_CSC_REMARKS,
    REG_YEAR,
    TS_REG_DATE,
    TS_MC_APPROVED_DATE,
    I_LOCALITY,
    VC_CERT_NO,
    VC_COURT_CASE_NO,
    VC_REG_DESIGNATION,
    VC_REG_REMARKS,
    V_REG_SIGN,
    VC_HASHKEY,
    REG_NO,
    TS_MC_APPROVED_DT,
    ULB_STATUS,
    ULB_REMARKS,
    SI_REMARKS,
    MC_STATUS,
    MC_REMARKS,
    SI_STATUS,
    BIRTH_TYPE,
    VC_STATUS_DT,
    VC_ULB_STATUS_DT,
    VC_SI_STATUS_DT,
    VC_MC_STATUS_DT,
    CITIZEN_ENT_ID,
    I_DISTRICT_ID,
    I_MANDAL_ID,
    I_FAT_LITERACY_ID,
    I_MOT_LITERACY_ID,
    I_FAT_OCC_ID,
    I_MOT_OCC_ID,
    I_RELIGION_ID,
    I_DELIVERYTYPE_ID,
    I_ATTENBIRTH_ID,
    FORM_UPLOAD1,
    VC_COUNTRY_NAME,
    VC_COUNTRY_ADDRESS,
    VC_NATIONALITY,
    IS_BACKLOG,
    VC_CHILDWEIGHT,
    VC_SUPPORTING_DOC
  ) {
    try {
      // var hash = sha256(new Date());
      const birthCert = {
        BIRTH_ID,
        TS_DATE_OF_BIRTH,
        I_ULBOBJID,
        VC_SEX,
        VC_SURNAMECHILD,
        docType: "birthCert",
        VC_NAME_CHILD,
        VC_AADHAR_NO,
        VC_SURNAME_FATHER,
        VC_NAME_FATHER,
        VC_AADHAR_NO_FATHER,
        VC_SURNAME_MOTHER,
        VC_NAME_MOTHER,
        VC_AADHAR_NO_MOTHER,
        VC_PLACE_OF_BIRTH,
        I_HOSPITAL_ID,
        VC_ADDRESS_LINE_1,
        VC_ADDRESS_LINE_2,
        VC_ADDRESS_LINE_3,
        VC_PIN_CODE,
        VC_ADDRESS_PARENT,
        VC_PERMANENT_ADDRESS_PARENT,
        VC_INFORMANT_SURNAME,
        VC_INFORMANT_NAME,
        VC_INFORMANT_ADDRESS,
        TS_INFORMED_DATE,
        VC_INFORMANT_SIGN,
        VC_INFORMANT_REMARKS,
        VC_MOBILE_NUMBER,
        VC_EMAIL_ID,
        VC_RESIDENCE,
        VC_NAME_TOWN,
        VC_NAME_MANDAL,
        VC_NAME_DISTRICT,
        VC_NAME_STATE,
        VC_RELIGION,
        VC_FATHER_LITERACY,
        VC_MOTHER_LITERACY,
        VC_FATHER_OCCUPATION,
        VC_MOTHER_OCCUPATION,
        VC_AGE_MOTHER,
        VC_AGE_MOTHER_DELIVERY,
        VC_NO_CHILD,
        VC_MEDICAL_ATTENTION,
        VC_DELIVERY_TYPE,
        VC_PREGNANCY_DURATION,
        VC_AFFIDAVIT,
        VC_NONAVAILABILITY,
        VC_MAGISTRATE_ORDER,
        VC_REMARKS,
        C_DELFLAG,
        TS_DTTM,
        I_CERATED_BY_ID,
        TS_CREATED_TIME,
        I_MODIFIED_BY_ID,
        TS_MODIFIED_TIME,
        VC_CREATED_IP,
        VC_MODIFIED_IP,
        I_APP_RECEIVED_ID,
        VC_STATUS,
        VC_MC_REMARKS,
        VC_ULB_VERIFIED,
        VC_CSC_REMARKS,
        REG_YEAR,
        TS_REG_DATE,
        TS_MC_APPROVED_DATE,
        I_LOCALITY,
        VC_CERT_NO,
        VC_COURT_CASE_NO,
        VC_REG_DESIGNATION,
        VC_REG_REMARKS,
        V_REG_SIGN,
        VC_HASHKEY,
        REG_NO,
        TS_MC_APPROVED_DT,
        ULB_STATUS,
        ULB_REMARKS,
        SI_REMARKS,
        MC_STATUS,
        MC_REMARKS,
        SI_STATUS,
        BIRTH_TYPE,
        VC_STATUS_DT,
        VC_ULB_STATUS_DT,
        VC_SI_STATUS_DT,
        VC_MC_STATUS_DT,
        CITIZEN_ENT_ID,
        I_DISTRICT_ID,
        I_MANDAL_ID,
        I_FAT_LITERACY_ID,
        I_MOT_LITERACY_ID,
        I_FAT_OCC_ID,
        I_MOT_OCC_ID,
        I_RELIGION_ID,
        I_DELIVERYTYPE_ID,
        I_ATTENBIRTH_ID,
        FORM_UPLOAD1,
        VC_COUNTRY_NAME,
        VC_COUNTRY_ADDRESS,
        VC_NATIONALITY,
        IS_BACKLOG,
        VC_CHILDWEIGHT,
        VC_SUPPORTING_DOC,
      };

      await ctx.stub.putState(id, Buffer.from(JSON.stringify(birthCert)));
    } catch (error) {
      console.log("error", error);
    }
  }

  async allList(ctx) {
    try {
      let queryString = {};
      queryString.selector = {
        docType: "birthCert",
      };
      let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
      let data = await this.filterQueryData(iterator);

      return JSON.parse(data);
    } catch (error) {
      console.log("error", error);
    }
  }

  async filterQueryData(iterator) {
    const allResults = [];
    while (true) {
      const res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        const Key = res.value.key;
        let Record;
        try {
          Record = JSON.parse(res.value.value.toString("utf8"));
        } catch (err) {
          Record = res.value.value.toString("utf8");
        }
        allResults.push({ Key, Record });
      }
      if (res.done) {
        await iterator.close();
        return JSON.stringify(allResults);
      }
    }
  }

  async getBirthCert(ctx, BIRTH_ID, id) {
    const birthCertAsBytes = await ctx.stub.getState(id);
    if (!birthCertAsBytes || birthCertAsBytes.length === 0) {
      throw new Error(`Birth certificate with ID: ${id} does not exist`);
    }

    const birthCert = JSON.parse(birthCertAsBytes.toString());
    if (birthCert.BIRTH_ID !== BIRTH_ID) {
      throw new Error(
        `Birth certificate with ID: ${id} does not belong to BIRTH_ID: ${BIRTH_ID}`
      );
    }

    return birthCertAsBytes.toString();
  }
}

module.exports = BirthCert;
