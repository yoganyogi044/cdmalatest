const { body, check, sanitize, validationResult } = require("express-validator");
const generateUniqueId = require('generate-unique-id');
const _DeathCertModel = require("../models/DeathCertificateModel")
const invoke = require('../../app/invoke-transaction.js');
const query = require('../../app/query.js');
var log4js = require('log4js');
const date = require('date-and-time')
const XLSX = require("xlsx");
var logger = log4js.getLogger('SampleWebApp');
// const UserModel = require("../models/Birth");
require('../../config.js');
const prometheus = require('prom-client');

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PROMETHEUS METRICS CONFIGURATION /////////////
///////////////////////////////////////////////////////////////////////////////


async function store(req, res, next) {

    try {

        await check("I_DEATH_REGISTRATION_ID").notEmpty().withMessage('Death_ID filed must be requerd').run(req);
        
        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "deathcert";
        var channelName = "mychannel";
        var fcn = "createDeathCert";

        var args = [];
        const id = generateUniqueId({ length: 64 });

        args.push(
            req.body.I_DEATH_REGISTRATION_ID,
             id,
            req.body.TS_DECEASED_DATE_OF_DEATH,
            req.body.I_ULBOBJID,
            req.body.VC_DECEASED_SURNAME,
            req.body.VC_DECEASED_NAME,
            req.body.VC_DECEASED_UID_OR_AADHAR_NUMBER,
            req.body.VC_PARENT_TYPE,
            req.body.VC_PARENT_SURNAME,
            req.body.VC_PARENT_NAME,
            req.body.VC_PARENT_AADHAR,
            req.body.VC_MOTHER_SURNAME,
            req.body.VC_MOTHER_NAME,
            req.body.VC_GENDER,
            req.body.VC_AGE_OF_TERM,
            req.body.I_AGE,
            req.body.VC_PLACE_OF_DEATH,
            req.body.VC_HOSPITAL_NAME,
            req.body.VC_ADDRESS_LINE1,
            req.body.VC_ADDRESS_LINE2,
            req.body.VC_ADDRESS_LINE3,
            req.body.VC_LOCALITY,
            req.body.I_PINCODE,
            req.body.VC_DEATH_PLACE,
            req.body.VC_DECEASED_PERMANENT_ADDRESS,
            req.body.VC_INFORMANT_SURNAME,
            req.body.VC_INFORMANT_NAME,
            req.body.VC_INFORMANT_ADDRESS,
            req.body.TS_INFORMANT_DATE,
            req.body.VC_INFORMANT_SIGN,
            req.body.VC_INFORMANT_REMARKS,
            req.body.VC_INFORMANT_MOBILE_NUMBER,
            req.body.VC_INFORMANT_EMAILID,
            req.body.VC_DECEASED_TOWN_OR_VILLAGE,
            req.body.VC_DECEASED_ID_TOWN_OR_VILLAGE,
            req.body.VC_DECEASED_STATE_ID,
            req.body.VC_DECEASED_DISTRICT_ID,
            req.body.VC_DECEASED_MANDAL_ID,
            req.body.VC_DECEASED_RELIGION_ID,
            req.body.VC_DECEASED_OCCUPATION,
            req.body.VC_DECEASED_MEDICAL_ATTENTION,
            req.body.VC_DECEASED_IS_MEDICAL_CERTIFIED,
            req.body.VC_DECEASED_CAUSE_OF_DEATH,
            req.body.VC_DECEASED_IS_PREGNANCY_DEATH,
            req.body.VC_DECEASED_SMOKING_FROM,
            req.body.VC_DECEASED_TOBACCO_FROM,
            req.body.VC_DECEASED_ALCOHOL_FROM,
            req.body.VC_DECEASED_PAN_FROM,
            req.body.VC_ENCLOUSER,
            req.body.VC_IMAGE_URL,
            req.body.C_DELFLAG,
            req.body.VC_REMARKS,
            req.body.I_CERATED_BY_ID,
            req.body.TS_CREATED_TIME,
            req.body.I_MODIFIED_BY_ID,
            req.body.TS_MODIFIED_TIME,
            req.body.VC_CREATED_IP,
            req.body.VC_MODIFIED_IP,
            req.body.I_APP_RECEIVED_ID,
            req.body.VC_STATUS,
            req.body.VC_MC_REMARKS,
            req.body.VC_CSC_REMARKS,
            req.body.I_HOSPITAL_ID,
            req.body.REG_YEAR,
            req.body.TS_MC_APPROVED_DATE,
            req.body.VC_HASHKEY,
            req.body.ULB_STATUS,
            req.body.SI_STATUS,
            req.body.SI_REMARKS,
            req.body.MC_STATUS,
            req.body.I_GENDER_ID,
            req.body.I_DISTRICT_ID,
            req.body.I_LOCALITY_ID,
            req.body.I_RELIGION_ID,
            req.body.I_OCCUPATION_ID,
            req.body.I_MEDICAL_ATTENTION_ID,
            req.body.I_CAUSE_OF_DEATH_ID,
            req.body.CITIZEN_ENT_ID,
            req.body.FORM_UPLOAD1,
            req.body.VC_AFFIDAVIT,
            req.body.VC_RDO,
            req.body.FORM_UPLOAD2,
            req.body.IS_BACKLOG,
            req.body.REG_NO,
            req.body.VC_COUNTRY_NAME,
            req.body.VC_COUNTRY_ADDRESS,
            req.body.VC_NATIONALITY,
            req.body.VC_SUPPORTING_DOC,
            req.body.TS_REG_DATE,
	    req.body.INFORMANT_RELATION_ID,
            req.body.PLACE_OF_CREMATION,
            req.body.PANCH_NAME1,
            req.body.PANCH_CONTACT1,
            req.body.PANCH_ADDRESS1,
            req.body.PANCH_AADHAR1,
            req.body.PANCH_NAME2,
            req.body.PANCH_CONTACT2,
            req.body.PANCH_ADDRESS2,
            req.body.PANCH_AADHAR2,
            req.body.FIR_NO,
            req.body.FIR_DATE,
            req.body.FIR_PLACE_DEATH,
            req.body.FIR_POLICE_STATION,
            req.body.PANCH_DET_FILE,
            req.body.HOS_DET_FILE,
            req.body.HOS_TOWN,
            req.body.HOS_DATE,
            req.body.PANCH_TYPE
               );

        const start = Date.now();
        let message = await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);

        let getUser = await query.queryChaincode("admin", channelName, chaincodeName, 'getDeathCert', [req.body.I_DEATH_REGISTRATION_ID, id]);
        console.log("ghfghgfhfgh", peers, channelName, chaincodeName, fcn, args, "admin", "Org1");
        console.log("getUser...................", getUser);
        console.log("message", message);
        const latency = Date.now() - start;
        if (typeof message != "string") {

            let data = {
                key: id,
                // tx_id: message,
                Record: {
                    
                    I_DEATH_REGISTRATION_ID: req.body.I_DEATH_REGISTRATION_ID,
                    docType: "deathCert",
                    TS_DECEASED_DATE_OF_DEATH: req.body.TS_DECEASED_DATE_OF_DEATH,
                    I_ULBOBJID: req.body.I_ULBOBJID,
                    VC_DECEASED_SURNAME: req.body.VC_DECEASED_SURNAME,
                    VC_DECEASED_NAME: req.body.VC_DECEASED_NAME,
                    VC_DECEASED_UID_OR_AADHAR_NUMBER: req.body.VC_DECEASED_UID_OR_AADHAR_NUMBER,
                    VC_PARENT_TYPE: req.body.VC_PARENT_TYPE,
                    VC_PARENT_SURNAME: req.body.VC_PARENT_SURNAME,
                    VC_PARENT_NAME: req.body.VC_PARENT_NAME,
                    VC_PARENT_AADHAR: req.body.VC_PARENT_AADHAR,
                    VC_MOTHER_SURNAME: req.body.VC_MOTHER_SURNAME,
                    VC_MOTHER_NAME: req.body.VC_MOTHER_NAME,
                    VC_GENDER: req.body.VC_GENDER,
                    VC_AGE_OF_TERM: req.body.VC_AGE_OF_TERM,
                    I_AGE: req.body.I_AGE,
                    VC_PLACE_OF_DEATH: req.body.VC_PLACE_OF_DEATH,
                    VC_HOSPITAL_NAME: req.body.VC_HOSPITAL_NAME,
                    VC_ADDRESS_LINE1: req.body.VC_ADDRESS_LINE1,
                    VC_ADDRESS_LINE2: req.body.VC_ADDRESS_LINE2,
                    VC_ADDRESS_LINE3: req.body.VC_ADDRESS_LINE3,
                    VC_LOCALITY: req.body.VC_LOCALITY,
                    I_PINCODE: req.body.I_PINCODE,
                    VC_DEATH_PLACE: req.body.VC_DEATH_PLACE,
                    VC_DECEASED_PERMANENT_ADDRESS: req.body.VC_DECEASED_PERMANENT_ADDRESS,
                    VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                    VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                    VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                    TS_INFORMANT_DATE: req.body.TS_INFORMANT_DATE,
                    VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                    VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                    VC_INFORMANT_MOBILE_NUMBER: req.body.VC_INFORMANT_MOBILE_NUMBER,
                    VC_INFORMANT_EMAILID: req.body.VC_INFORMANT_EMAILID,
                    VC_DECEASED_TOWN_OR_VILLAGE: req.body.VC_DECEASED_TOWN_OR_VILLAGE,
                    VC_DECEASED_ID_TOWN_OR_VILLAGE: req.body.VC_DECEASED_ID_TOWN_OR_VILLAGE,
                    VC_DECEASED_STATE_ID: req.body.VC_DECEASED_STATE_ID,
                    VC_DECEASED_DISTRICT_ID: req.body.VC_DECEASED_DISTRICT_ID,
                    VC_DECEASED_MANDAL_ID: req.body.VC_DECEASED_MANDAL_ID,
                    VC_DECEASED_RELIGION_ID: req.body.VC_DECEASED_RELIGION_ID,
                    VC_DECEASED_OCCUPATION: req.body.VC_DECEASED_OCCUPATION,
                    VC_DECEASED_MEDICAL_ATTENTION: req.body.VC_DECEASED_MEDICAL_ATTENTION,
                    VC_DECEASED_IS_MEDICAL_CERTIFIED: req.body.VC_DECEASED_IS_MEDICAL_CERTIFIED,
                    VC_DECEASED_CAUSE_OF_DEATH: req.body.VC_DECEASED_CAUSE_OF_DEATH,
                    VC_DECEASED_IS_PREGNANCY_DEATH: req.body.VC_DECEASED_IS_PREGNANCY_DEATH,
                    VC_DECEASED_SMOKING_FROM: req.body.VC_DECEASED_SMOKING_FROM,
                    VC_DECEASED_TOBACCO_FROM: req.body.VC_DECEASED_TOBACCO_FROM,
                    VC_DECEASED_ALCOHOL_FROM: req.body.VC_DECEASED_ALCOHOL_FROM,
                    VC_DECEASED_PAN_FROM: req.body.VC_DECEASED_PAN_FROM,
                    VC_ENCLOUSER: req.body.VC_ENCLOUSER,
                    VC_IMAGE_URL: req.body.VC_IMAGE_URL,
                    C_DELFLAG: req.body.C_DELFLAG,
                    VC_REMARKS: req.body.VC_REMARKS,
                    I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                    TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                    I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                    TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                    VC_CREATED_IP: req.body.VC_CREATED_IP,
                    VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                    I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                    VC_STATUS: req.body.VC_STATUS,
                    VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                    VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                    I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                    REG_YEAR: req.body.REG_YEAR,
                    TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                    VC_HASHKEY: req.body.VC_HASHKEY,
                    ULB_STATUS: req.body.ULB_STATUS,
                    SI_STATUS: req.body.SI_STATUS,
                    SI_REMARKS: req.body.SI_REMARKS,
                    MC_STATUS: req.body.MC_STATUS,
                    I_GENDER_ID: req.body.I_GENDER_ID,
                    I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                    I_LOCALITY_ID: req.body.I_LOCALITY_ID,
                    I_RELIGION_ID: req.body.I_RELIGION_ID,
                    I_OCCUPATION_ID: req.body.I_OCCUPATION_ID,
                    I_MEDICAL_ATTENTION_ID: req.body.I_MEDICAL_ATTENTION_ID,
                    I_CAUSE_OF_DEATH_ID: req.body.I_CAUSE_OF_DEATH_ID,
                    CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                    FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                    VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                    VC_RDO: req.body.VC_RDO,
                    FORM_UPLOAD2: req.body.FORM_UPLOAD2,
                    IS_BACKLOG: req.body.IS_BACKLOG,
                    REG_NO: req.body.REG_NO,
                    VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                    VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                    VC_NATIONALITY: req.body.VC_NATIONALITY,
                    VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                    TS_REG_DATE: req.body.TS_REG_DATE,
		    INFORMANT_RELATION_ID: req.body.INFORMANT_RELATION_ID,
                    PLACE_OF_CREMATION: req.body.PLACE_OF_CREMATION,
                    PANCH_NAME1: req.body.PANCH_NAME1,
                    PANCH_CONTACT1: req.body.PANCH_CONTACT1,
                    PANCH_ADDRESS1: req.body.PANCH_ADDRESS1,
                    PANCH_AADHAR1: req.body.PANCH_AADHAR1,
                    PANCH_NAME2: req.body.PANCH_NAME2,
                    PANCH_CONTACT2: req.body.PANCH_CONTACT2,
                    PANCH_ADDRESS2: req.body.PANCH_ADDRESS2,
                    PANCH_AADHAR2: req.body.PANCH_AADHAR2,
                    FIR_NO: req.body.FIR_NO,
                    FIR_DATE: req.body.FIR_DATE,
                    FIR_PLACE_DEATH: req.body.FIR_PLACE_DEATH,
                    FIR_POLICE_STATION: req.body.FIR_POLICE_STATION,
                    PANCH_DET_FILE: req.body.PANCH_DET_FILE,
                    HOS_DET_FILE: req.body.HOS_DET_FILE,
                    HOS_TOWN: req.body.HOS_TOWN,
                    HOS_DATE: req.body.HOS_DATE,
                    PANCH_TYPE: req.body.PANCH_TYPE
                },

            }


            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(400).json({
                status: 400,
                success: false,
                message: "Deaththday certificate not inserte!",
                data: data
            })

        } else {

            let data = {
                key: id,
                // tx_id: message,
                Record: {
                    I_DEATH_REGISTRATION_ID: req.body.I_DEATH_REGISTRATION_ID,
                    docType: "deathCert",
                    TS_DECEASED_DATE_OF_DEATH: req.body.TS_DECEASED_DATE_OF_DEATH,
                    I_ULBOBJID: req.body.I_ULBOBJID,
                    VC_DECEASED_SURNAME: req.body.VC_DECEASED_SURNAME,
                    VC_DECEASED_NAME: req.body.VC_DECEASED_NAME,
                    VC_DECEASED_UID_OR_AADHAR_NUMBER: req.body.VC_DECEASED_UID_OR_AADHAR_NUMBER,
                    VC_PARENT_TYPE: req.body.VC_PARENT_TYPE,
                    VC_PARENT_SURNAME: req.body.VC_PARENT_SURNAME,
                    VC_PARENT_NAME: req.body.VC_PARENT_NAME,
                    VC_PARENT_AADHAR: req.body.VC_PARENT_AADHAR,
                    VC_MOTHER_SURNAME: req.body.VC_MOTHER_SURNAME,
                    VC_MOTHER_NAME: req.body.VC_MOTHER_NAME,
                    VC_GENDER: req.body.VC_GENDER,
                    VC_AGE_OF_TERM: req.body.VC_AGE_OF_TERM,
                    I_AGE: req.body.I_AGE,
                    VC_PLACE_OF_DEATH: req.body.VC_PLACE_OF_DEATH,
                    VC_HOSPITAL_NAME: req.body.VC_HOSPITAL_NAME,
                    VC_ADDRESS_LINE1: req.body.VC_ADDRESS_LINE1,
                    VC_ADDRESS_LINE2: req.body.VC_ADDRESS_LINE2,
                    VC_ADDRESS_LINE3: req.body.VC_ADDRESS_LINE3,
                    VC_LOCALITY: req.body.VC_LOCALITY,
                    I_PINCODE: req.body.I_PINCODE,
                    VC_DEATH_PLACE: req.body.VC_DEATH_PLACE,
                    VC_DECEASED_PERMANENT_ADDRESS: req.body.VC_DECEASED_PERMANENT_ADDRESS,
                    VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                    VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                    VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                    TS_INFORMANT_DATE: req.body.TS_INFORMANT_DATE,
                    VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                    VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                    VC_INFORMANT_MOBILE_NUMBER: req.body.VC_INFORMANT_MOBILE_NUMBER,
                    VC_INFORMANT_EMAILID: req.body.VC_INFORMANT_EMAILID,
                    VC_DECEASED_TOWN_OR_VILLAGE: req.body.VC_DECEASED_TOWN_OR_VILLAGE,
                    VC_DECEASED_ID_TOWN_OR_VILLAGE: req.body.VC_DECEASED_ID_TOWN_OR_VILLAGE,
                    VC_DECEASED_STATE_ID: req.body.VC_DECEASED_STATE_ID,
                    VC_DECEASED_DISTRICT_ID: req.body.VC_DECEASED_DISTRICT_ID,
                    VC_DECEASED_MANDAL_ID: req.body.VC_DECEASED_MANDAL_ID,
                    VC_DECEASED_RELIGION_ID: req.body.VC_DECEASED_RELIGION_ID,
                    VC_DECEASED_OCCUPATION: req.body.VC_DECEASED_OCCUPATION,
                    VC_DECEASED_MEDICAL_ATTENTION: req.body.VC_DECEASED_MEDICAL_ATTENTION,
                    VC_DECEASED_IS_MEDICAL_CERTIFIED: req.body.VC_DECEASED_IS_MEDICAL_CERTIFIED,
                    VC_DECEASED_CAUSE_OF_DEATH: req.body.VC_DECEASED_CAUSE_OF_DEATH,
                    VC_DECEASED_IS_PREGNANCY_DEATH: req.body.VC_DECEASED_IS_PREGNANCY_DEATH,
                    VC_DECEASED_SMOKING_FROM: req.body.VC_DECEASED_SMOKING_FROM,
                    VC_DECEASED_TOBACCO_FROM: req.body.VC_DECEASED_TOBACCO_FROM,
                    VC_DECEASED_ALCOHOL_FROM: req.body.VC_DECEASED_ALCOHOL_FROM,
                    VC_DECEASED_PAN_FROM: req.body.VC_DECEASED_PAN_FROM,
                    VC_ENCLOUSER: req.body.VC_ENCLOUSER,
                    VC_IMAGE_URL: req.body.VC_IMAGE_URL,
                    C_DELFLAG: req.body.C_DELFLAG,
                    VC_REMARKS: req.body.VC_REMARKS,
                    I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                    TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                    I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                    TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                    VC_CREATED_IP: req.body.VC_CREATED_IP,
                    VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                    I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                    VC_STATUS: req.body.VC_STATUS,
                    VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                    VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                    I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                    REG_YEAR: req.body.REG_YEAR,
                    TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                    VC_HASHKEY: req.body.VC_HASHKEY,
                    ULB_STATUS: req.body.ULB_STATUS,
                    SI_STATUS: req.body.SI_STATUS,
                    SI_REMARKS: req.body.SI_REMARKS,
                    MC_STATUS: req.body.MC_STATUS,
                    I_GENDER_ID: req.body.I_GENDER_ID,
                    I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                    I_LOCALITY_ID: req.body.I_LOCALITY_ID,
                    I_RELIGION_ID: req.body.I_RELIGION_ID,
                    I_OCCUPATION_ID: req.body.I_OCCUPATION_ID,
                    I_MEDICAL_ATTENTION_ID: req.body.I_MEDICAL_ATTENTION_ID,
                    I_CAUSE_OF_DEATH_ID: req.body.I_CAUSE_OF_DEATH_ID,
                    CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                    FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                    VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                    VC_RDO: req.body.VC_RDO,
                    FORM_UPLOAD2: req.body.FORM_UPLOAD2,
                    IS_BACKLOG: req.body.IS_BACKLOG,
                    REG_NO: req.body.REG_NO,
                    VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                    VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                    VC_NATIONALITY: req.body.VC_NATIONALITY,
                    VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                    TS_REG_DATE: req.body.TS_REG_DATE,
		    INFORMANT_RELATION_ID: req.body.INFORMANT_RELATION_ID,
                    PLACE_OF_CREMATION: req.body.PLACE_OF_CREMATION,
                    PANCH_NAME1: req.body.PANCH_NAME1,
                    PANCH_CONTACT1: req.body.PANCH_CONTACT1,
                    PANCH_ADDRESS1: req.body.PANCH_ADDRESS1,
                    PANCH_AADHAR1: req.body.PANCH_AADHAR1,
                    PANCH_NAME2: req.body.PANCH_NAME2,
                    PANCH_CONTACT2: req.body.PANCH_CONTACT2,
                    PANCH_ADDRESS2: req.body.PANCH_ADDRESS2,
                    PANCH_AADHAR2: req.body.PANCH_AADHAR2,
                    FIR_NO: req.body.FIR_NO,
                    FIR_DATE: req.body.FIR_DATE,
                    FIR_PLACE_DEATH: req.body.FIR_PLACE_DEATH,
                    FIR_POLICE_STATION: req.body.FIR_POLICE_STATION,
                    PANCH_DET_FILE: req.body.PANCH_DET_FILE,
                    HOS_DET_FILE: req.body.HOS_DET_FILE,
                    HOS_TOWN: req.body.HOS_TOWN,
                    HOS_DATE: req.body.HOS_DATE,
                    PANCH_TYPE: req.body.PANCH_TYPE
                },

            }

          

            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Death certificate inserted successfully!",
                data: data
            })
        }

    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}

async function update(req, res, next) {

    try {

        
        await check("I_DEATH_REGISTRATION_ID").notEmpty().withMessage('Death_ID filed must be requerd').run(req);
        await check("Key").notEmpty().withMessage('Key filed must be requerd').run(req);
        

        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "deathcert";
        var channelName = "mychannel";
        var fcn = "createDeathCert";

        let oldData = await query.queryChaincode("admin", channelName, chaincodeName, 'getDeathCert', [req.body.I_DEATH_REGISTRATION_ID, req.body.Key]);

        if (typeof oldData != "object") {

            var args = [];
            const id = generateUniqueId({ length: 64 });


            args.push(
                    req.body.I_DEATH_REGISTRATION_ID,
                    id, 
                    req.body.TS_DECEASED_DATE_OF_DEATH,
                    req.body.I_ULBOBJID,
                    req.body.VC_DECEASED_SURNAME,
                    req.body.VC_DECEASED_NAME,
                    req.body.VC_DECEASED_UID_OR_AADHAR_NUMBER,
                    req.body.VC_PARENT_TYPE,
                    req.body.VC_PARENT_SURNAME,
                    req.body.VC_PARENT_NAME,
                    req.body.VC_PARENT_AADHAR,
                    req.body.VC_MOTHER_SURNAME,
                    req.body.VC_MOTHER_NAME,
                    req.body.VC_GENDER,
                    req.body.VC_AGE_OF_TERM,
                    req.body.I_AGE,
                    req.body.VC_PLACE_OF_DEATH,
                    req.body.VC_HOSPITAL_NAME,
                    req.body.VC_ADDRESS_LINE1,
                    req.body.VC_ADDRESS_LINE2,
                    req.body.VC_ADDRESS_LINE3,
                    req.body.VC_LOCALITY,
                    req.body.I_PINCODE,
                    req.body.VC_DEATH_PLACE,
                    req.body.VC_DECEASED_PERMANENT_ADDRESS,
                    req.body.VC_INFORMANT_SURNAME,
                    req.body.VC_INFORMANT_NAME,
                    req.body.VC_INFORMANT_ADDRESS,
                    req.body.TS_INFORMANT_DATE,
                    req.body.VC_INFORMANT_SIGN,
                    req.body.VC_INFORMANT_REMARKS,
                    req.body.VC_INFORMANT_MOBILE_NUMBER,
                    req.body.VC_INFORMANT_EMAILID,
                    req.body.VC_DECEASED_TOWN_OR_VILLAGE,
                    req.body.VC_DECEASED_ID_TOWN_OR_VILLAGE,
                    req.body.VC_DECEASED_STATE_ID,
                    req.body.VC_DECEASED_DISTRICT_ID,
                    req.body.VC_DECEASED_MANDAL_ID,
                    req.body.VC_DECEASED_RELIGION_ID,
                    req.body.VC_DECEASED_OCCUPATION,
                    req.body.VC_DECEASED_MEDICAL_ATTENTION,
                    req.body.VC_DECEASED_IS_MEDICAL_CERTIFIED,
                    req.body.VC_DECEASED_CAUSE_OF_DEATH,
                    req.body.VC_DECEASED_IS_PREGNANCY_DEATH,
                    req.body.VC_DECEASED_SMOKING_FROM,
                    req.body.VC_DECEASED_TOBACCO_FROM,
                    req.body.VC_DECEASED_ALCOHOL_FROM,
                    req.body.VC_DECEASED_PAN_FROM,
                    req.body.VC_ENCLOUSER,
                    req.body.VC_IMAGE_URL,
                    req.body.C_DELFLAG,
                    req.body.VC_REMARKS,
                    req.body.I_CERATED_BY_ID,
                    req.body.TS_CREATED_TIME,
                    req.body.I_MODIFIED_BY_ID,
                    req.body.TS_MODIFIED_TIME,
                    req.body.VC_CREATED_IP,
                    req.body.VC_MODIFIED_IP,
                    req.body.I_APP_RECEIVED_ID,
                    req.body.VC_STATUS,
                    req.body.VC_MC_REMARKS,
                    req.body.VC_CSC_REMARKS,
                    req.body.I_HOSPITAL_ID,
                    req.body.REG_YEAR,
                    req.body.TS_MC_APPROVED_DATE,
                    req.body.VC_HASHKEY,
                    req.body.ULB_STATUS,
                    req.body.SI_STATUS,
                    req.body.SI_REMARKS,
                    req.body.MC_STATUS,
                    req.body.I_GENDER_ID,
                    req.body.I_DISTRICT_ID,
                    req.body.I_LOCALITY_ID,
                    req.body.I_RELIGION_ID,
                    req.body.I_OCCUPATION_ID,
                    req.body.I_MEDICAL_ATTENTION_ID,
                    req.body.I_CAUSE_OF_DEATH_ID,
                    req.body.CITIZEN_ENT_ID,
                    req.body.FORM_UPLOAD1,
                    req.body.VC_AFFIDAVIT,
                    req.body.VC_RDO,
                    req.body.FORM_UPLOAD2,
                    req.body.IS_BACKLOG,
                    req.body.REG_NO,
                    req.body.VC_COUNTRY_NAME,
                    req.body.VC_COUNTRY_ADDRESS,
                    req.body.VC_NATIONALITY,
                    req.body.VC_SUPPORTING_DOC,
                    req.body.TS_REG_DATE,
		    req.body.INFORMANT_RELATION_ID,
                    req.body.PLACE_OF_CREMATION,
                    req.body.PANCH_NAME1,
                    req.body.PANCH_CONTACT1,
                    req.body.PANCH_ADDRESS1,
                    req.body.PANCH_AADHAR1,
                    req.body.PANCH_NAME2,
                    req.body.PANCH_CONTACT2,
                    req.body.PANCH_ADDRESS2,
                    req.body.PANCH_AADHAR2,
                    req.body.FIR_NO,
                    req.body.FIR_DATE,
                    req.body.FIR_PLACE_DEATH,
                    req.body.FIR_POLICE_STATION,
                    req.body.PANCH_DET_FILE,
                    req.body.HOS_DET_FILE,
                    req.body.HOS_TOWN,
                    req.body.HOS_DATE,
                    req.body.PANCH_TYPE
                   );

            
            const start = Date.now();
            let message = await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);

            let getUser = await query.queryChaincode("admin", channelName, chaincodeName, 'getDeathCert', [req.body.I_DEATH_REGISTRATION_ID, id]);
            console.log("ghfghgfhfgh", peers, channelName, chaincodeName, fcn, args, "admin", "Org1");
            console.log("getUser", getUser);
            console.log("message", message);
            const latency = Date.now() - start;
            if (typeof message != "string") {

                let data = {
                    key: id,
                    old_key: req.body.Key,
                    // tx_id: message,
                    Record: {
                        I_DEATH_REGISTRATION_ID: req.body.I_DEATH_REGISTRATION_ID,
                        docType: "deathCert",
                        TS_DECEASED_DATE_OF_DEATH: req.body.TS_DECEASED_DATE_OF_DEATH,
                        I_ULBOBJID: req.body.I_ULBOBJID,
                        VC_DECEASED_SURNAME: req.body.VC_DECEASED_SURNAME,
                        VC_DECEASED_NAME: req.body.VC_DECEASED_NAME,
                        VC_DECEASED_UID_OR_AADHAR_NUMBER: req.body.VC_DECEASED_UID_OR_AADHAR_NUMBER,
                        VC_PARENT_TYPE: req.body.VC_PARENT_TYPE,
                        VC_PARENT_SURNAME: req.body.VC_PARENT_SURNAME,
                        VC_PARENT_NAME: req.body.VC_PARENT_NAME,
                        VC_PARENT_AADHAR: req.body.VC_PARENT_AADHAR,
                        VC_MOTHER_SURNAME: req.body.VC_MOTHER_SURNAME,
                        VC_MOTHER_NAME: req.body.VC_MOTHER_NAME,
                        VC_GENDER: req.body.VC_GENDER,
                        VC_AGE_OF_TERM: req.body.VC_AGE_OF_TERM,
                        I_AGE: req.body.I_AGE,
                        VC_PLACE_OF_DEATH: req.body.VC_PLACE_OF_DEATH,
                        VC_HOSPITAL_NAME: req.body.VC_HOSPITAL_NAME,
                        VC_ADDRESS_LINE1: req.body.VC_ADDRESS_LINE1,
                        VC_ADDRESS_LINE2: req.body.VC_ADDRESS_LINE2,
                        VC_ADDRESS_LINE3: req.body.VC_ADDRESS_LINE3,
                        VC_LOCALITY: req.body.VC_LOCALITY,
                        I_PINCODE: req.body.I_PINCODE,
                        VC_DEATH_PLACE: req.body.VC_DEATH_PLACE,
                        VC_DECEASED_PERMANENT_ADDRESS: req.body.VC_DECEASED_PERMANENT_ADDRESS,
                        VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                        VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                        VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                        TS_INFORMANT_DATE: req.body.TS_INFORMANT_DATE,
                        VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                        VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                        VC_INFORMANT_MOBILE_NUMBER: req.body.VC_INFORMANT_MOBILE_NUMBER,
                        VC_INFORMANT_EMAILID: req.body.VC_INFORMANT_EMAILID,
                        VC_DECEASED_TOWN_OR_VILLAGE: req.body.VC_DECEASED_TOWN_OR_VILLAGE,
                        VC_DECEASED_ID_TOWN_OR_VILLAGE: req.body.VC_DECEASED_ID_TOWN_OR_VILLAGE,
                        VC_DECEASED_STATE_ID: req.body.VC_DECEASED_STATE_ID,
                        VC_DECEASED_DISTRICT_ID: req.body.VC_DECEASED_DISTRICT_ID,
                        VC_DECEASED_MANDAL_ID: req.body.VC_DECEASED_MANDAL_ID,
                        VC_DECEASED_RELIGION_ID: req.body.VC_DECEASED_RELIGION_ID,
                        VC_DECEASED_OCCUPATION: req.body.VC_DECEASED_OCCUPATION,
                        VC_DECEASED_MEDICAL_ATTENTION: req.body.VC_DECEASED_MEDICAL_ATTENTION,
                        VC_DECEASED_IS_MEDICAL_CERTIFIED: req.body.VC_DECEASED_IS_MEDICAL_CERTIFIED,
                        VC_DECEASED_CAUSE_OF_DEATH: req.body.VC_DECEASED_CAUSE_OF_DEATH,
                        VC_DECEASED_IS_PREGNANCY_DEATH: req.body.VC_DECEASED_IS_PREGNANCY_DEATH,
                        VC_DECEASED_SMOKING_FROM: req.body.VC_DECEASED_SMOKING_FROM,
                        VC_DECEASED_TOBACCO_FROM: req.body.VC_DECEASED_TOBACCO_FROM,
                        VC_DECEASED_ALCOHOL_FROM: req.body.VC_DECEASED_ALCOHOL_FROM,
                        VC_DECEASED_PAN_FROM: req.body.VC_DECEASED_PAN_FROM,
                        VC_ENCLOUSER: req.body.VC_ENCLOUSER,
                        VC_IMAGE_URL: req.body.VC_IMAGE_URL,
                        C_DELFLAG: req.body.C_DELFLAG,
                        VC_REMARKS: req.body.VC_REMARKS,
                        I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                        TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                        I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                        TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                        VC_CREATED_IP: req.body.VC_CREATED_IP,
                        VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                        I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                        VC_STATUS: req.body.VC_STATUS,
                        VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                        VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                        I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                        REG_YEAR: req.body.REG_YEAR,
                        TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                        VC_HASHKEY: req.body.VC_HASHKEY,
                        ULB_STATUS: req.body.ULB_STATUS,
                        SI_STATUS: req.body.SI_STATUS,
                        SI_REMARKS: req.body.SI_REMARKS,
                        MC_STATUS: req.body.MC_STATUS,
                        I_GENDER_ID: req.body.I_GENDER_ID,
                        I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                        I_LOCALITY_ID: req.body.I_LOCALITY_ID,
                        I_RELIGION_ID: req.body.I_RELIGION_ID,
                        I_OCCUPATION_ID: req.body.I_OCCUPATION_ID,
                        I_MEDICAL_ATTENTION_ID: req.body.I_MEDICAL_ATTENTION_ID,
                        I_CAUSE_OF_DEATH_ID: req.body.I_CAUSE_OF_DEATH_ID,
                        CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                        FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                        VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                        VC_RDO: req.body.VC_RDO,
                        FORM_UPLOAD2: req.body.FORM_UPLOAD2,
                        IS_BACKLOG: req.body.IS_BACKLOG,
                        REG_NO: req.body.REG_NO,
                        VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                        VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                        VC_NATIONALITY: req.body.VC_NATIONALITY,
                        VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                        TS_REG_DATE: req.body.TS_REG_DATE,
			INFORMANT_RELATION_ID: req.body.INFORMANT_RELATION_ID,
                        PLACE_OF_CREMATION: req.body.PLACE_OF_CREMATION,
                        PANCH_NAME1: req.body.PANCH_NAME1,
                        PANCH_CONTACT1: req.body.PANCH_CONTACT1,
                        PANCH_ADDRESS1: req.body.PANCH_ADDRESS1,
                        PANCH_AADHAR1: req.body.PANCH_AADHAR1,
                        PANCH_NAME2: req.body.PANCH_NAME2,
                        PANCH_CONTACT2: req.body.PANCH_CONTACT2,
                        PANCH_ADDRESS2: req.body.PANCH_ADDRESS2,
                        PANCH_AADHAR2: req.body.PANCH_AADHAR2,
                        FIR_NO: req.body.FIR_NO,
                        FIR_DATE: req.body.FIR_DATE,
                        FIR_PLACE_DEATH: req.body.FIR_PLACE_DEATH,
                        FIR_POLICE_STATION: req.body.FIR_POLICE_STATION,
                        PANCH_DET_FILE: req.body.PANCH_DET_FILE,
                        HOS_DET_FILE: req.body.HOS_DET_FILE,
                        HOS_TOWN: req.body.HOS_TOWN,
                        HOS_DATE: req.body.HOS_DATE,
                        PANCH_TYPE: req.body.PANCH_TYPE
                    },

                }


                return res.status(400).json({
                    status: 400,
                    success: true,
                    message: "Death certificate not verified",
                    data: data
                })

                 } else {

                let data = {
                    key: id,
                    old_key: req.body.Key,
                    // tx_id: message,
                    Record: {
                    I_DEATH_REGISTRATION_ID: req.body.I_DEATH_REGISTRATION_ID,
                    docType: "deathCert",
                    TS_DECEASED_DATE_OF_DEATH: req.body.TS_DECEASED_DATE_OF_DEATH,
                    I_ULBOBJID: req.body.I_ULBOBJID,
                    VC_DECEASED_SURNAME: req.body.VC_DECEASED_SURNAME,
                    VC_DECEASED_NAME: req.body.VC_DECEASED_NAME,
                    VC_DECEASED_UID_OR_AADHAR_NUMBER: req.body.VC_DECEASED_UID_OR_AADHAR_NUMBER,
                    VC_PARENT_TYPE: req.body.VC_PARENT_TYPE,
                    VC_PARENT_SURNAME: req.body.VC_PARENT_SURNAME,
                    VC_PARENT_NAME: req.body.VC_PARENT_NAME,
                    VC_PARENT_AADHAR: req.body.VC_PARENT_AADHAR,
                    VC_MOTHER_SURNAME: req.body.VC_MOTHER_SURNAME,
                    VC_MOTHER_NAME: req.body.VC_MOTHER_NAME,
                    VC_GENDER: req.body.VC_GENDER,
                    VC_AGE_OF_TERM: req.body.VC_AGE_OF_TERM,
                    I_AGE: req.body.I_AGE,
                    VC_PLACE_OF_DEATH: req.body.VC_PLACE_OF_DEATH,
                    VC_HOSPITAL_NAME: req.body.VC_HOSPITAL_NAME,
                    VC_ADDRESS_LINE1: req.body.VC_ADDRESS_LINE1,
                    VC_ADDRESS_LINE2: req.body.VC_ADDRESS_LINE2,
                    VC_ADDRESS_LINE3: req.body.VC_ADDRESS_LINE3,
                    VC_LOCALITY: req.body.VC_LOCALITY,
                    I_PINCODE: req.body.I_PINCODE,
                    VC_DEATH_PLACE: req.body.VC_DEATH_PLACE,
                    VC_DECEASED_PERMANENT_ADDRESS: req.body.VC_DECEASED_PERMANENT_ADDRESS,
                    VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                    VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                    VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                    TS_INFORMANT_DATE: req.body.TS_INFORMANT_DATE,
                    VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                    VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                    VC_INFORMANT_MOBILE_NUMBER: req.body.VC_INFORMANT_MOBILE_NUMBER,
                    VC_INFORMANT_EMAILID: req.body.VC_INFORMANT_EMAILID,
                    VC_DECEASED_TOWN_OR_VILLAGE: req.body.VC_DECEASED_TOWN_OR_VILLAGE,
                    VC_DECEASED_ID_TOWN_OR_VILLAGE: req.body.VC_DECEASED_ID_TOWN_OR_VILLAGE,
                    VC_DECEASED_STATE_ID: req.body.VC_DECEASED_STATE_ID,
                    VC_DECEASED_DISTRICT_ID: req.body.VC_DECEASED_DISTRICT_ID,
                    VC_DECEASED_MANDAL_ID: req.body.VC_DECEASED_MANDAL_ID,
                    VC_DECEASED_RELIGION_ID: req.body.VC_DECEASED_RELIGION_ID,
                    VC_DECEASED_OCCUPATION: req.body.VC_DECEASED_OCCUPATION,
                    VC_DECEASED_MEDICAL_ATTENTION: req.body.VC_DECEASED_MEDICAL_ATTENTION,
                    VC_DECEASED_IS_MEDICAL_CERTIFIED: req.body.VC_DECEASED_IS_MEDICAL_CERTIFIED,
                    VC_DECEASED_CAUSE_OF_DEATH: req.body.VC_DECEASED_CAUSE_OF_DEATH,
                    VC_DECEASED_IS_PREGNANCY_DEATH: req.body.VC_DECEASED_IS_PREGNANCY_DEATH,
                    VC_DECEASED_SMOKING_FROM: req.body.VC_DECEASED_SMOKING_FROM,
                    VC_DECEASED_TOBACCO_FROM: req.body.VC_DECEASED_TOBACCO_FROM,
                    VC_DECEASED_ALCOHOL_FROM: req.body.VC_DECEASED_ALCOHOL_FROM,
                    VC_DECEASED_PAN_FROM: req.body.VC_DECEASED_PAN_FROM,
                    VC_ENCLOUSER: req.body.VC_ENCLOUSER,
                    VC_IMAGE_URL: req.body.VC_IMAGE_URL,
                    C_DELFLAG: req.body.C_DELFLAG,
                    VC_REMARKS: req.body.VC_REMARKS,
                    I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                    TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                    I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                    TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                    VC_CREATED_IP: req.body.VC_CREATED_IP,
                    VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                    I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                    VC_STATUS: req.body.VC_STATUS,
                    VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                    VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                    I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                    REG_YEAR: req.body.REG_YEAR,
                    TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                    VC_HASHKEY: req.body.VC_HASHKEY,
                    ULB_STATUS: req.body.ULB_STATUS,
                    SI_STATUS: req.body.SI_STATUS,
                    SI_REMARKS: req.body.SI_REMARKS,
                    MC_STATUS: req.body.MC_STATUS,
                    I_GENDER_ID: req.body.I_GENDER_ID,
                    I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                    I_LOCALITY_ID: req.body.I_LOCALITY_ID,
                    I_RELIGION_ID: req.body.I_RELIGION_ID,
                    I_OCCUPATION_ID: req.body.I_OCCUPATION_ID,
                    I_MEDICAL_ATTENTION_ID: req.body.I_MEDICAL_ATTENTION_ID,
                    I_CAUSE_OF_DEATH_ID: req.body.I_CAUSE_OF_DEATH_ID,
                    CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                    FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                    VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                    VC_RDO: req.body.VC_RDO,
                    FORM_UPLOAD2: req.body.FORM_UPLOAD2,
                    IS_BACKLOG: req.body.IS_BACKLOG,
                    REG_NO: req.body.REG_NO,
                    VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                    VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                    VC_NATIONALITY: req.body.VC_NATIONALITY,
                    VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                    TS_REG_DATE: req.body.TS_REG_DATE,
		    INFORMANT_RELATION_ID: req.body.INFORMANT_RELATION_ID,
                    PLACE_OF_CREMATION: req.body.PLACE_OF_CREMATION,
                    PANCH_NAME1: req.body.PANCH_NAME1,
                    PANCH_CONTACT1: req.body.PANCH_CONTACT1,
                    PANCH_ADDRESS1: req.body.PANCH_ADDRESS1,
                    PANCH_AADHAR1: req.body.PANCH_AADHAR1,
                    PANCH_NAME2: req.body.PANCH_NAME2,
                    PANCH_CONTACT2: req.body.PANCH_CONTACT2,
                    PANCH_ADDRESS2: req.body.PANCH_ADDRESS2,
                    PANCH_AADHAR2: req.body.PANCH_AADHAR2,
                    FIR_NO: req.body.FIR_NO,
                    FIR_DATE: req.body.FIR_DATE,
                    FIR_PLACE_DEATH: req.body.FIR_PLACE_DEATH,
                    FIR_POLICE_STATION: req.body.FIR_POLICE_STATION,
                    PANCH_DET_FILE: req.body.PANCH_DET_FILE,
                    HOS_DET_FILE: req.body.HOS_DET_FILE,
                    HOS_TOWN: req.body.HOS_TOWN,
                    HOS_DATE: req.body.HOS_DATE,
                    PANCH_TYPE: req.body.PANCH_TYPE
                        },

                }
               
                

                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Death certificate verified and updated successfully!",
                    data: data
                })
            }


        }

        return res.status(400).json({
            status: 400,
            success: false,
            message: "Death certificate not verified",
            data: ""
        })


    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}


async function index(req, res, next) {
    try {

        var channelName = "mychannel";
        var chaincodeName = "deathcert";
        let args = req.query.args;
        let fcn = 'allList';


        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        console.log('args==========', args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        const start = Date.now();
        let message = await query.queryChaincode("admin", channelName, chaincodeName, fcn, args);
        // message = message.replace(/'/g, '"');


        data = JSON.parse(message)
        return res.status(200).json({
            status: 200,
            success: true,
            message: "All Death certificate found successfully",
            data: data
        })

    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}

async function show(req, res, next) {
    try {

        var channelName = "mychannel";
        var chaincodeName = "deathcert";
        let args = req.query.args;;
        let fcn = 'getDeathCert';

        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        console.log('args==========', args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        const start = Date.now();
        let message = await query.queryChaincode("admin", channelName, chaincodeName, fcn, args);
        // message = message.replace(/'/g, '"');
        const latency = Date.now() - start;

        logger.debug("Data............", message);
        if (typeof message != "object") {

            data = JSON.parse(message)
            data = {
                key: args[1],
                Record: data
            }

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Validated successfully!",
                data: data
            })

        } else {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Not valid!",
                data: ""
            })

        }


    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}


exports.store = store;
exports.update = update;
exports.index = index;
exports.show = show;
