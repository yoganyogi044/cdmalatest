/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class DeathCert extends Contract {
  async initLedger(ctx) {
    console.info("============= START : Initialize Ledger ===========");
    console.info("============= END : Initialize Ledger ===========");
  }

  async createDeathCert(
    ctx,
    I_DEATH_REGISTRATION_ID,
    id,
    TS_DECEASED_DATE_OF_DEATH,
    I_ULBOBJID,
    VC_DECEASED_SURNAME,
    VC_DECEASED_NAME,
    VC_DECEASED_UID_OR_AADHAR_NUMBER,
    VC_PARENT_TYPE,
    VC_PARENT_SURNAME,
    VC_PARENT_NAME,
    VC_PARENT_AADHAR,
    VC_MOTHER_SURNAME,
    VC_MOTHER_NAME,
    VC_GENDER,
    VC_AGE_OF_TERM,
    I_AGE,
    VC_PLACE_OF_DEATH,
    VC_HOSPITAL_NAME,
    VC_ADDRESS_LINE1,
    VC_ADDRESS_LINE2,
    VC_ADDRESS_LINE3,
    VC_LOCALITY,
    I_PINCODE,
    VC_DEATH_PLACE,
    VC_DECEASED_PERMANENT_ADDRESS,
    VC_INFORMANT_SURNAME,
    VC_INFORMANT_NAME,
    VC_INFORMANT_ADDRESS,
    TS_INFORMANT_DATE,
    VC_INFORMANT_SIGN,
    VC_INFORMANT_REMARKS,
    VC_INFORMANT_MOBILE_NUMBER,
    VC_INFORMANT_EMAILID,
    VC_DECEASED_TOWN_OR_VILLAGE,
    VC_DECEASED_ID_TOWN_OR_VILLAGE,
    VC_DECEASED_STATE_ID,
    VC_DECEASED_DISTRICT_ID,
    VC_DECEASED_MANDAL_ID,
    VC_DECEASED_RELIGION_ID,
    VC_DECEASED_OCCUPATION,
    VC_DECEASED_MEDICAL_ATTENTION,
    VC_DECEASED_IS_MEDICAL_CERTIFIED,
    VC_DECEASED_CAUSE_OF_DEATH,
    VC_DECEASED_IS_PREGNANCY_DEATH,
    VC_DECEASED_SMOKING_FROM,
    VC_DECEASED_TOBACCO_FROM,
    VC_DECEASED_ALCOHOL_FROM,
    VC_DECEASED_PAN_FROM,
    VC_ENCLOUSER,
    VC_IMAGE_URL,
    C_DELFLAG,
    VC_REMARKS,
    I_CERATED_BY_ID,
    TS_CREATED_TIME,
    I_MODIFIED_BY_ID,
    TS_MODIFIED_TIME,
    VC_CREATED_IP,
    VC_MODIFIED_IP,
    I_APP_RECEIVED_ID,
    VC_STATUS,
    VC_MC_REMARKS,
    VC_CSC_REMARKS,
    I_HOSPITAL_ID,
    REG_YEAR,
    TS_MC_APPROVED_DATE,
    VC_HASHKEY,
    ULB_STATUS,
    SI_STATUS,
    SI_REMARKS,
    MC_STATUS,
    I_GENDER_ID,
    I_DISTRICT_ID,
    I_LOCALITY_ID,
    I_RELIGION_ID,
    I_OCCUPATION_ID,
    I_MEDICAL_ATTENTION_ID,
    I_CAUSE_OF_DEATH_ID,
    CITIZEN_ENT_ID,
    FORM_UPLOAD1,
    VC_AFFIDAVIT,
    VC_RDO,
    FORM_UPLOAD2,
    IS_BACKLOG,
    REG_NO,
    VC_COUNTRY_NAME,
    VC_COUNTRY_ADDRESS,
    VC_NATIONALITY,
    VC_SUPPORTING_DOC,
    TS_REG_DATE,
    INFORMANT_RELATION_ID,
    PLACE_OF_CREMATION,
    PANCH_NAME1,
    PANCH_CONTACT1,
    PANCH_ADDRESS1,
    PANCH_AADHAR1,
    PANCH_NAME2,
    PANCH_CONTACT2,
    PANCH_ADDRESS2,
    PANCH_AADHAR2,
    FIR_NO,
    FIR_DATE,
    FIR_PLACE_DEATH,
    FIR_POLICE_STATION,
    PANCH_DET_FILE,
    HOS_DET_FILE,
    HOS_TOWN,
    HOS_DATE,
    PANCH_TYPE
  ) {
    try {
      // var hash = sha256(new Date());
      const deathCert = {
        I_DEATH_REGISTRATION_ID,
        TS_DECEASED_DATE_OF_DEATH,
        I_ULBOBJID,
        docType: "deathCert",
        VC_DECEASED_SURNAME,
        VC_DECEASED_NAME,
        VC_DECEASED_UID_OR_AADHAR_NUMBER,
        VC_PARENT_TYPE,
        VC_PARENT_SURNAME,
        VC_PARENT_NAME,
        VC_PARENT_AADHAR,
        VC_MOTHER_SURNAME,
        VC_MOTHER_NAME,
        VC_GENDER,
        VC_AGE_OF_TERM,
        I_AGE,
        VC_PLACE_OF_DEATH,
        VC_HOSPITAL_NAME,
        VC_ADDRESS_LINE1,
        VC_ADDRESS_LINE2,
        VC_ADDRESS_LINE3,
        VC_LOCALITY,
        I_PINCODE,
        VC_DEATH_PLACE,
        VC_DECEASED_PERMANENT_ADDRESS,
        VC_INFORMANT_SURNAME,
        VC_INFORMANT_NAME,
        VC_INFORMANT_ADDRESS,
        TS_INFORMANT_DATE,
        VC_INFORMANT_SIGN,
        VC_INFORMANT_REMARKS,
        VC_INFORMANT_MOBILE_NUMBER,
        VC_INFORMANT_EMAILID,
        VC_DECEASED_TOWN_OR_VILLAGE,
        VC_DECEASED_ID_TOWN_OR_VILLAGE,
        VC_DECEASED_STATE_ID,
        VC_DECEASED_DISTRICT_ID,
        VC_DECEASED_MANDAL_ID,
        VC_DECEASED_RELIGION_ID,
        VC_DECEASED_OCCUPATION,
        VC_DECEASED_MEDICAL_ATTENTION,
        VC_DECEASED_IS_MEDICAL_CERTIFIED,
        VC_DECEASED_CAUSE_OF_DEATH,
        VC_DECEASED_IS_PREGNANCY_DEATH,
        VC_DECEASED_SMOKING_FROM,
        VC_DECEASED_TOBACCO_FROM,
        VC_DECEASED_ALCOHOL_FROM,
        VC_DECEASED_PAN_FROM,
        VC_ENCLOUSER,
        VC_IMAGE_URL,
        C_DELFLAG,
        VC_REMARKS,
        I_CERATED_BY_ID,
        TS_CREATED_TIME,
        I_MODIFIED_BY_ID,
        TS_MODIFIED_TIME,
        VC_CREATED_IP,
        VC_MODIFIED_IP,
        I_APP_RECEIVED_ID,
        VC_STATUS,
        VC_MC_REMARKS,
        VC_CSC_REMARKS,
        I_HOSPITAL_ID,
        REG_YEAR,
        TS_MC_APPROVED_DATE,
        VC_HASHKEY,
        ULB_STATUS,
        SI_STATUS,
        SI_REMARKS,
        MC_STATUS,
        I_GENDER_ID,
        I_DISTRICT_ID,
        I_LOCALITY_ID,
        I_RELIGION_ID,
        I_OCCUPATION_ID,
        I_MEDICAL_ATTENTION_ID,
        I_CAUSE_OF_DEATH_ID,
        CITIZEN_ENT_ID,
        FORM_UPLOAD1,
        VC_AFFIDAVIT,
        VC_RDO,
        FORM_UPLOAD2,
        IS_BACKLOG,
        REG_NO,
        VC_COUNTRY_NAME,
        VC_COUNTRY_ADDRESS,
        VC_NATIONALITY,
        VC_SUPPORTING_DOC,
        TS_REG_DATE,
	INFORMANT_RELATION_ID,
        PLACE_OF_CREMATION,
        PANCH_NAME1,
        PANCH_CONTACT1,
        PANCH_ADDRESS1,
        PANCH_AADHAR1,
        PANCH_NAME2,
        PANCH_CONTACT2,
        PANCH_ADDRESS2,
        PANCH_AADHAR2,
        FIR_NO,
        FIR_DATE,
        FIR_PLACE_DEATH,
        FIR_POLICE_STATION,
        PANCH_DET_FILE,
        HOS_DET_FILE,
        HOS_TOWN,
        HOS_DATE,
        PANCH_TYPE
      };

      await ctx.stub.putState(id, Buffer.from(JSON.stringify(deathCert)));
    } catch (error) {
      console.log("error", error);
    }
  }

  async allList(ctx) {
    try {
      let queryString = {};
      queryString.selector = {
        docType: "deathCert",
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

  async getDeathCert(ctx, I_DEATH_REGISTRATION_ID, id) {
    const deathCertAsBytes = await ctx.stub.getState(id);
    if (!deathCertAsBytes || deathCertAsBytes.length === 0) {
      throw new Error(`Death certificate with ID: ${id} does not exist`);
    }

    const deathCert = JSON.parse(deathCertAsBytes.toString());
    if (deathCert.I_DEATH_REGISTRATION_ID !== I_DEATH_REGISTRATION_ID) {
      throw new Error(
        `Death certificate with ID: ${id} does not belong to I_DEATH_REGISTRATION_ID: ${I_DEATH_REGISTRATION_ID}`
      );
    }

    return deathCertAsBytes.toString();
  }
}

module.exports = DeathCert;
