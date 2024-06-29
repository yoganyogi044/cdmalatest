/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class StillbirthCert extends Contract {
  async initLedger(ctx) {
    console.info("============= START : Initialize Ledger ===========");
    console.info("============= END : Initialize Ledger ===========");
  }

  async createStillbirthCert(
    ctx,
    I_STILL_BIRTH_ID,
    id,
    TS_DATE_OF_BIRTH,
    I_ULBOBJID,
    VC_GENDER,
    VC_FATHER_SURNAME,
    VC_FATHER_NAME,
    VC_FATHER_AADHAR,
    VC_MOTHER_SURNAME,
    VC_MOTHER_NAME,
    VC_MOTHER_AADHAR,
    VC_PLACE_OF_BIRTH,
    VC_HOSPITAL_NAME,
    VC_ADDRESS_LINE1,
    VC_ADDRESS_LINE2,
    VC_ADDRESS_LINE3,
    VC_LOCALITY,
    I_PINCODE,
    VC_INFORMANT_SURNAME,
    VC_INFORMANT_NAME,
    VC_INFORMANT_ADDRESS,
    TS_INFORMANT_DATE,
    VC_INFORMANT_SIGN,
    VC_INFORMANT_REMARKS,
    VC_INFORMANT_MOBILE_NUMBER,
    VC_INFORMANT_EMAILID,
    VC_TOWN_OR_VILLAGE,
    VC_NAME_OF_TOWN_OR_VILLAGE,
    VC_STATE,
    VC_DISTRICT,
    VC_MANDAL,
    I_DELIVERY_AGE,
    VC_MOTHER_LITERACY,
    VC_ATTENTION_DELIVERY,
    I_DURATION_OF_PREGNANCY,
    VC_CAUSE_OF_TOTAL_DEATH,
    VC_ENCLOUSER,
    VC_IMAGE_URL,
    VC_REMARKS,
    I_CERATED_BY_ID,
    I_MODIFIED_BY_ID,
    VC_CREATED_IP,
    VC_MODIFIED_IP,
    I_APP_RECEIVED_ID,
    VC_STATUS,
    VC_MC_REMARKS,
    VC_MC_STATUS,
    VC_SI_STATUS,
    VC_SI_REMARKS,
    ULB_STATUS,
    ULB_REMARKS,
    CITIZEN_ENT_ID,
    IS_BACKLOG,
    REG_NO,
    VC_COUNTRY_NAME,
    VC_COUNTRY_ADDRESS,
    VC_NATIONALITY,
    FORM_UPLOAD3,
    VC_HASHKEY,
    TS_DTTM,
    VC_AFFIDAVIT,
    VC_MAGISTRATEORDER,
    I_GENDER_ID,
    I_HOSPITAL_ID,
    I_STATE_ID,
    I_DISTRICT_ID,
    I_MOTHER_LITERACY_ID,
    I_DELIVERY_TYPE_ID,
    I_CAUSE_OF_DEATH_ID,
    I_LOCALITY_ID,
    VC_SUPPORTING_DOC,
    TS_MC_APPROVED_DATE,
    TS_CREATED_TIME,
    C_DELFLAG,
    REG_YEAR,
    TS_REG_DATE
  ) {
    try {
      // var hash = sha256(new Date());
      const stillbirthCert = {
        I_STILL_BIRTH_ID,
        TS_DATE_OF_BIRTH,
        I_ULBOBJID,
        docType: "stillbirthCert",
        VC_GENDER,
        VC_FATHER_SURNAME,
        VC_FATHER_NAME,
        VC_FATHER_AADHAR,
        VC_MOTHER_SURNAME,
        VC_MOTHER_NAME,
        VC_MOTHER_AADHAR,
        VC_PLACE_OF_BIRTH,
        VC_HOSPITAL_NAME,
        VC_ADDRESS_LINE1,
        VC_ADDRESS_LINE2,
        VC_ADDRESS_LINE3,
        VC_LOCALITY,
        I_PINCODE,
        VC_INFORMANT_SURNAME,
        VC_INFORMANT_NAME,
        VC_INFORMANT_ADDRESS,
        TS_INFORMANT_DATE,
        VC_INFORMANT_SIGN,
        VC_INFORMANT_REMARKS,
        VC_INFORMANT_MOBILE_NUMBER,
        VC_INFORMANT_EMAILID,
        VC_TOWN_OR_VILLAGE,
        VC_NAME_OF_TOWN_OR_VILLAGE,
        VC_STATE,
        VC_DISTRICT,
        VC_MANDAL,
        I_DELIVERY_AGE,
        VC_MOTHER_LITERACY,
        VC_ATTENTION_DELIVERY,
        I_DURATION_OF_PREGNANCY,
        VC_CAUSE_OF_TOTAL_DEATH,
        VC_ENCLOUSER,
        VC_IMAGE_URL,
        VC_REMARKS,
        I_CERATED_BY_ID,
        I_MODIFIED_BY_ID,
        VC_CREATED_IP,
        VC_MODIFIED_IP,
        I_APP_RECEIVED_ID,
        VC_STATUS,
        VC_MC_REMARKS,
        VC_MC_STATUS,
        VC_SI_STATUS,
        VC_SI_REMARKS,
        ULB_STATUS,
        ULB_REMARKS,
        CITIZEN_ENT_ID,
        IS_BACKLOG,
        REG_NO,
        VC_COUNTRY_NAME,
        VC_COUNTRY_ADDRESS,
        VC_NATIONALITY,
        FORM_UPLOAD3,
        VC_HASHKEY,
        TS_DTTM,
        VC_AFFIDAVIT,
        VC_MAGISTRATEORDER,
        I_GENDER_ID,
        I_HOSPITAL_ID,
        I_STATE_ID,
        I_DISTRICT_ID,
        I_MOTHER_LITERACY_ID,
        I_DELIVERY_TYPE_ID,
        I_CAUSE_OF_DEATH_ID,
        I_LOCALITY_ID,
        VC_SUPPORTING_DOC,
        TS_MC_APPROVED_DATE,
        TS_CREATED_TIME,
        C_DELFLAG,
        REG_YEAR,
        TS_REG_DATE,
      };

      await ctx.stub.putState(id, Buffer.from(JSON.stringify(stillbirthCert)));
    } catch (error) {
      console.log("error", error);
    }
  }

  async allList(ctx) {
    try {
      let queryString = {};
      queryString.selector = {
        docType: "StillbirthCert",
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

  async getStillbirthCert(ctx, I_STILL_BIRTH_ID, id) {
    const stillbirthCertAsBytes = await ctx.stub.getState(id);
    if (!stillbirthCertAsBytes || stillbirthCertAsBytes.length === 0) {
      throw new Error(`Stillbirth certificate with ID: ${id} does not exist`);
    }

    const stillbirthCert = JSON.parse(stillbirthCertAsBytes.toString());
    if (stillbirthCert.I_STILL_BIRTH_ID !== I_STILL_BIRTH_ID) {
      throw new Error(
        `Stillirth certificate with ID: ${id} does not belong to I_STILL_BIRTH_ID: ${I_STILL_BIRTH_ID}`
      );
    }

    return stillbirthCertAsBytes.toString();
  }
}

module.exports = StillbirthCert;
