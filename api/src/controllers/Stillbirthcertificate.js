const { body, check, sanitize, validationResult } = require("express-validator");
const generateUniqueId = require('generate-unique-id');
const _StillbirthCertModel = require("../models/StillbirthCertificateModel")
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

       
        await check("I_STILL_BIRTH_ID").notEmpty().withMessage('I_STILL_BIRTH_ID filed must be requerd').run(req);
        
        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "stillbirthcert";
        var channelName = "mychannel";
        var fcn = "createStillbirthCert";

        var args = [];
        const id = generateUniqueId({ length: 64 });

        args.push(
                req.body.I_STILL_BIRTH_ID,
                id,
                req.body.TS_DATE_OF_BIRTH,
                req.body.I_ULBOBJID,
                req.body.VC_GENDER,
                req.body.VC_FATHER_SURNAME,
                req.body.VC_FATHER_NAME,
                req.body.VC_FATHER_AADHAR,
                req.body.VC_MOTHER_SURNAME,
                req.body.VC_MOTHER_NAME,
                req.body.VC_MOTHER_AADHAR,
                req.body.VC_PLACE_OF_BIRTH,
                req.body.VC_HOSPITAL_NAME,
                req.body.VC_ADDRESS_LINE1,
                req.body.VC_ADDRESS_LINE2,
                req.body.VC_ADDRESS_LINE3,
                req.body.VC_LOCALITY,
                req.body.I_PINCODE,
                req.body.VC_INFORMANT_SURNAME,
                req.body.VC_INFORMANT_NAME,
                req.body.VC_INFORMANT_ADDRESS,
                req.body.TS_INFORMANT_DATE,
                req.body.VC_INFORMANT_SIGN,
                req.body.VC_INFORMANT_REMARKS,
                req.body.VC_INFORMANT_MOBILE_NUMBER,
                req.body.VC_INFORMANT_EMAILID,
                req.body.VC_TOWN_OR_VILLAGE,
                req.body.VC_NAME_OF_TOWN_OR_VILLAGE,
                req.body.VC_STATE,
                req.body.VC_DISTRICT,
                req.body.VC_MANDAL,
                req.body.I_DELIVERY_AGE,
                req.body.VC_MOTHER_LITERACY,
                req.body.VC_ATTENTION_DELIVERY,
                req.body.I_DURATION_OF_PREGNANCY,
                req.body.VC_CAUSE_OF_TOTAL_DEATH,
                req.body.VC_ENCLOUSER,
                req.body.VC_IMAGE_URL,
                req.body.VC_REMARKS,
                req.body.I_CERATED_BY_ID,
                req.body.I_MODIFIED_BY_ID,
                req.body.VC_CREATED_IP,
                req.body.VC_MODIFIED_IP,
                req.body.I_APP_RECEIVED_ID,
                req.body.VC_STATUS,
                req.body.VC_MC_REMARKS,
                req.body.VC_MC_STATUS,
                req.body.VC_SI_STATUS,
                req.body.VC_SI_REMARKS,
                req.body.ULB_STATUS,
                req.body.ULB_REMARKS,
                req.body.CITIZEN_ENT_ID,
                req.body.IS_BACKLOG,
                req.body.REG_NO,
                req.body.VC_COUNTRY_NAME,
                req.body.VC_COUNTRY_ADDRESS,
                req.body.VC_NATIONALITY,
                req.body.FORM_UPLOAD3,
                req.body.VC_HASHKEY,
                req.body.TS_DTTM,
                req.body.VC_AFFIDAVIT,
                req.body.VC_MAGISTRATEORDER,
                req.body.I_GENDER_ID,
                req.body.I_HOSPITAL_ID,
                req.body.I_STATE_ID,
                req.body.I_DISTRICT_ID,
                req.body.I_MOTHER_LITERACY_ID,
                req.body.I_DELIVERY_TYPE_ID,
                req.body.I_CAUSE_OF_DEATH_ID,
                req.body.I_LOCALITY_ID,
                req.body.VC_SUPPORTING_DOC,
                req.body.TS_MC_APPROVED_DATE,
                req.body.TS_CREATED_TIME,
                req.body.C_DELFLAG,
                req.body.REG_YEAR,
                req.body.TS_REG_DATE
              );

        const start = Date.now();
        let message = await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);

        let getUser = await query.queryChaincode("admin", channelName, chaincodeName, 'getStillbirthCert', [req.body.I_STILL_BIRTH_ID, id]);
        console.log("ghfghgfhfgh", peers, channelName, chaincodeName, fcn, args, "admin", "Org1");
        console.log("getUser...................", getUser);
        console.log("message", message);
        const latency = Date.now() - start;
        if (typeof message != "string") {

            let data = {
                key: id,
                // tx_id: message,
                Record: {
                    I_STILL_BIRTH_ID: req.body.I_STILL_BIRTH_ID,
                        TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                        I_ULBOBJID: req.body.I_ULBOBJID,
                        docType: "stillbirthCert",
                        VC_GENDER: req.body.VC_GENDER,
                        VC_FATHER_SURNAME: req.body.VC_FATHER_SURNAME,
                        VC_FATHER_NAME: req.body.VC_FATHER_NAME,
                        VC_FATHER_AADHAR: req.body.VC_FATHER_AADHAR,
                        VC_MOTHER_SURNAME: req.body.VC_MOTHER_SURNAME,
                        VC_MOTHER_NAME: req.body.VC_MOTHER_NAME,
                        VC_MOTHER_AADHAR: req.body.VC_MOTHER_AADHAR,
                        VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                        VC_HOSPITAL_NAME: req.body.VC_HOSPITAL_NAME,
                        VC_ADDRESS_LINE1: req.body.VC_ADDRESS_LINE1,
                        VC_ADDRESS_LINE2: req.body.VC_ADDRESS_LINE2,
                        VC_ADDRESS_LINE3: req.body.VC_ADDRESS_LINE3,
                        VC_LOCALITY: req.body.VC_LOCALITY,
                        I_PINCODE: req.body.I_PINCODE,
                        VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                        VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                        VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                        TS_INFORMANT_DATE: req.body.TS_INFORMANT_DATE,
                        VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                        VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                        VC_INFORMANT_MOBILE_NUMBER: req.body.VC_INFORMANT_MOBILE_NUMBER,
                        VC_INFORMANT_EMAILID: req.body.VC_INFORMANT_EMAILID,
                        VC_TOWN_OR_VILLAGE: req.body.VC_TOWN_OR_VILLAGE,
                        VC_NAME_OF_TOWN_OR_VILLAGE: req.body.VC_NAME_OF_TOWN_OR_VILLAGE,
                        VC_STATE: req.body.VC_STATE,
                        VC_DISTRICT: req.body.VC_DISTRICT,
                        VC_MANDAL: req.body.VC_MANDAL,
                        I_DELIVERY_AGE: req.body.I_DELIVERY_AGE,
                        VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                        VC_ATTENTION_DELIVERY: req.body.VC_ATTENTION_DELIVERY,
                        I_DURATION_OF_PREGNANCY: req.body.I_DURATION_OF_PREGNANCY,
                        VC_CAUSE_OF_TOTAL_DEATH: req.body.VC_CAUSE_OF_TOTAL_DEATH,
                        VC_ENCLOUSER: req.body.VC_ENCLOUSER,
                        VC_IMAGE_URL: req.body.VC_IMAGE_URL,
                        VC_REMARKS: req.body.VC_REMARKS,
                        I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                        I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                        VC_CREATED_IP: req.body.VC_CREATED_IP,
                        VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                        I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                        VC_STATUS: req.body.VC_STATUS,
                        VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                        VC_MC_STATUS: req.body.VC_MC_STATUS,
                        VC_SI_STATUS: req.body.VC_SI_STATUS,
                        VC_SI_REMARKS: req.body.VC_SI_REMARKS,
                        ULB_STATUS: req.body.ULB_STATUS,
                        ULB_REMARKS: req.body.ULB_REMARKS,
                        CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                        IS_BACKLOG: req.body.IS_BACKLOG,
                        REG_NO: req.body.REG_NO,
                        VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                        VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                        VC_NATIONALITY: req.body.VC_NATIONALITY,
                        FORM_UPLOAD3: req.body.FORM_UPLOAD3,
                        VC_HASHKEY: req.body.VC_HASHKEY,
                        TS_DTTM: req.body.TS_DTTM,
                        VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                        VC_MAGISTRATEORDER: req.body.VC_MAGISTRATEORDER,
                        I_GENDER_ID: req.body.I_GENDER_ID,
                        I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                        I_STATE_ID: req.body.I_STATE_ID,
                        I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                        I_MOTHER_LITERACY_ID: req.body.I_MOTHER_LITERACY_ID,
                        I_DELIVERY_TYPE_ID: req.body.I_DELIVERY_TYPE_ID,
                        I_CAUSE_OF_DEATH_ID: req.body.I_CAUSE_OF_DEATH_ID,
                        I_LOCALITY_ID: req.body.I_LOCALITY_ID,
                        VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                        TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                        TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                        C_DELFLAG: req.body.C_DELFLAG,
                        REG_YEAR: req.body.REG_YEAR,
                        TS_REG_DATE: req.body.TS_REG_DATE
                },

            }


            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(400).json({
                status: 400,
                success: false,
                message: "still birth certificate not inserte!",
                data: data
            })

        } else {

            let data = {
                key: id,
                // tx_id: message,
                Record: {
                    I_STILL_BIRTH_ID: req.body.I_STILL_BIRTH_ID,
                        TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                        I_ULBOBJID: req.body.I_ULBOBJID,
                        docType: "stillbirthCert",
                        VC_GENDER: req.body.VC_GENDER,
                        VC_FATHER_SURNAME: req.body.VC_FATHER_SURNAME,
                        VC_FATHER_NAME: req.body.VC_FATHER_NAME,
                        VC_FATHER_AADHAR: req.body.VC_FATHER_AADHAR,
                        VC_MOTHER_SURNAME: req.body.VC_MOTHER_SURNAME,
                        VC_MOTHER_NAME: req.body.VC_MOTHER_NAME,
                        VC_MOTHER_AADHAR: req.body.VC_MOTHER_AADHAR,
                        VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                        VC_HOSPITAL_NAME: req.body.VC_HOSPITAL_NAME,
                        VC_ADDRESS_LINE1: req.body.VC_ADDRESS_LINE1,
                        VC_ADDRESS_LINE2: req.body.VC_ADDRESS_LINE2,
                        VC_ADDRESS_LINE3: req.body.VC_ADDRESS_LINE3,
                        VC_LOCALITY: req.body.VC_LOCALITY,
                        I_PINCODE: req.body.I_PINCODE,
                        VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                        VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                        VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                        TS_INFORMANT_DATE: req.body.TS_INFORMANT_DATE,
                        VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                        VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                        VC_INFORMANT_MOBILE_NUMBER: req.body.VC_INFORMANT_MOBILE_NUMBER,
                        VC_INFORMANT_EMAILID: req.body.VC_INFORMANT_EMAILID,
                        VC_TOWN_OR_VILLAGE: req.body.VC_TOWN_OR_VILLAGE,
                        VC_NAME_OF_TOWN_OR_VILLAGE: req.body.VC_NAME_OF_TOWN_OR_VILLAGE,
                        VC_STATE: req.body.VC_STATE,
                        VC_DISTRICT: req.body.VC_DISTRICT,
                        VC_MANDAL: req.body.VC_MANDAL,
                        I_DELIVERY_AGE: req.body.I_DELIVERY_AGE,
                        VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                        VC_ATTENTION_DELIVERY: req.body.VC_ATTENTION_DELIVERY,
                        I_DURATION_OF_PREGNANCY: req.body.I_DURATION_OF_PREGNANCY,
                        VC_CAUSE_OF_TOTAL_DEATH: req.body.VC_CAUSE_OF_TOTAL_DEATH,
                        VC_ENCLOUSER: req.body.VC_ENCLOUSER,
                        VC_IMAGE_URL: req.body.VC_IMAGE_URL,
                        VC_REMARKS: req.body.VC_REMARKS,
                        I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                        I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                        VC_CREATED_IP: req.body.VC_CREATED_IP,
                        VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                        I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                        VC_STATUS: req.body.VC_STATUS,
                        VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                        VC_MC_STATUS: req.body.VC_MC_STATUS,
                        VC_SI_STATUS: req.body.VC_SI_STATUS,
                        VC_SI_REMARKS: req.body.VC_SI_REMARKS,
                        ULB_STATUS: req.body.ULB_STATUS,
                        ULB_REMARKS: req.body.ULB_REMARKS,
                        CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                        IS_BACKLOG: req.body.IS_BACKLOG,
                        REG_NO: req.body.REG_NO,
                        VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                        VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                        VC_NATIONALITY: req.body.VC_NATIONALITY,
                        FORM_UPLOAD3: req.body.FORM_UPLOAD3,
                        VC_HASHKEY: req.body.VC_HASHKEY,
                        TS_DTTM: req.body.TS_DTTM,
                        VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                        VC_MAGISTRATEORDER: req.body.VC_MAGISTRATEORDER,
                        I_GENDER_ID: req.body.I_GENDER_ID,
                        I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                        I_STATE_ID: req.body.I_STATE_ID,
                        I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                        I_MOTHER_LITERACY_ID: req.body.I_MOTHER_LITERACY_ID,
                        I_DELIVERY_TYPE_ID: req.body.I_DELIVERY_TYPE_ID,
                        I_CAUSE_OF_DEATH_ID: req.body.I_CAUSE_OF_DEATH_ID,
                        I_LOCALITY_ID: req.body.I_LOCALITY_ID,
                        VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                        TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                        TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                        C_DELFLAG: req.body.C_DELFLAG,
                        REG_YEAR: req.body.REG_YEAR,
                        TS_REG_DATE: req.body.TS_REG_DATE
                },

            }

            


            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "still birth certificate inserted successfully!",
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

        
        await check("I_STILL_BIRTH_ID").notEmpty().withMessage('I_STILL_BIRTH_ID  filed must be requerd').run(req);
        

        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "stillbirthcert";
        var channelName = "mychannel";
        var fcn = "createStillbirthCert";

        let oldData = await query.queryChaincode("admin", channelName, chaincodeName, 'getStillbirthCert', [req.body.I_STILL_BIRTH_ID, req.body.Key]);

        if (typeof oldData != "object") {

            var args = [];
            const id = generateUniqueId({ length: 64 });


            args.push(
                req.body.I_STILL_BIRTH_ID,
                id,
                req.body.TS_DATE_OF_BIRTH,
                req.body.I_ULBOBJID,
                req.body.VC_GENDER,
                req.body.VC_FATHER_SURNAME,
                req.body.VC_FATHER_NAME,
                req.body.VC_FATHER_AADHAR,
                req.body.VC_MOTHER_SURNAME,
                req.body.VC_MOTHER_NAME,
                req.body.VC_MOTHER_AADHAR,
                req.body.VC_PLACE_OF_BIRTH,
                req.body.VC_HOSPITAL_NAME,
                req.body.VC_ADDRESS_LINE1,
                req.body.VC_ADDRESS_LINE2,
                req.body.VC_ADDRESS_LINE3,
                req.body.VC_LOCALITY,
                req.body.I_PINCODE,
                req.body.VC_INFORMANT_SURNAME,
                req.body.VC_INFORMANT_NAME,
                req.body.VC_INFORMANT_ADDRESS,
                req.body.TS_INFORMANT_DATE,
                req.body.VC_INFORMANT_SIGN,
                req.body.VC_INFORMANT_REMARKS,
                req.body.VC_INFORMANT_MOBILE_NUMBER,
                req.body.VC_INFORMANT_EMAILID,
                req.body.VC_TOWN_OR_VILLAGE,
                req.body.VC_NAME_OF_TOWN_OR_VILLAGE,
                req.body.VC_STATE,
                req.body.VC_DISTRICT,
                req.body.VC_MANDAL,
                req.body.I_DELIVERY_AGE,
                req.body.VC_MOTHER_LITERACY,
                req.body.VC_ATTENTION_DELIVERY,
                req.body.I_DURATION_OF_PREGNANCY,
                req.body.VC_CAUSE_OF_TOTAL_DEATH,
                req.body.VC_ENCLOUSER,
                req.body.VC_IMAGE_URL,
                req.body.VC_REMARKS,
                req.body.I_CERATED_BY_ID,
                req.body.I_MODIFIED_BY_ID,
                req.body.VC_CREATED_IP,
                req.body.VC_MODIFIED_IP,
                req.body.I_APP_RECEIVED_ID,
                req.body.VC_STATUS,
                req.body.VC_MC_REMARKS,
                req.body.VC_MC_STATUS,
                req.body.VC_SI_STATUS,
                req.body.VC_SI_REMARKS,
                req.body.ULB_STATUS,
                req.body.ULB_REMARKS,
                req.body.CITIZEN_ENT_ID,
                req.body.IS_BACKLOG,
                req.body.REG_NO,
                req.body.VC_COUNTRY_NAME,
                req.body.VC_COUNTRY_ADDRESS,
                req.body.VC_NATIONALITY,
                req.body.FORM_UPLOAD3,
                req.body.VC_HASHKEY,
                req.body.TS_DTTM,
                req.body.VC_AFFIDAVIT,
                req.body.VC_MAGISTRATEORDER,
                req.body.I_GENDER_ID,
                req.body.I_HOSPITAL_ID,
                req.body.I_STATE_ID,
                req.body.I_DISTRICT_ID,
                req.body.I_MOTHER_LITERACY_ID,
                req.body.I_DELIVERY_TYPE_ID,
                req.body.I_CAUSE_OF_DEATH_ID,
                req.body.I_LOCALITY_ID,
                req.body.VC_SUPPORTING_DOC,
                req.body.TS_MC_APPROVED_DATE,
                req.body.TS_CREATED_TIME,
                req.body.C_DELFLAG,
                req.body.REG_YEAR,
                req.body.TS_REG_DATE
                 );

            
            const start = Date.now();
            let message = await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);

            let getUser = await query.queryChaincode("admin", channelName, chaincodeName, 'getStillbirthCert', [req.body.I_STILL_BIRTH_ID, id]);
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
                        I_STILL_BIRTH_ID: req.body.I_STILL_BIRTH_ID,
                        TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                        I_ULBOBJID: req.body.I_ULBOBJID,
                        docType: "stillbirthCert",
                        VC_GENDER: req.body.VC_GENDER,
                        VC_FATHER_SURNAME: req.body.VC_FATHER_SURNAME,
                        VC_FATHER_NAME: req.body.VC_FATHER_NAME,
                        VC_FATHER_AADHAR: req.body.VC_FATHER_AADHAR,
                        VC_MOTHER_SURNAME: req.body.VC_MOTHER_SURNAME,
                        VC_MOTHER_NAME: req.body.VC_MOTHER_NAME,
                        VC_MOTHER_AADHAR: req.body.VC_MOTHER_AADHAR,
                        VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                        VC_HOSPITAL_NAME: req.body.VC_HOSPITAL_NAME,
                        VC_ADDRESS_LINE1: req.body.VC_ADDRESS_LINE1,
                        VC_ADDRESS_LINE2: req.body.VC_ADDRESS_LINE2,
                        VC_ADDRESS_LINE3: req.body.VC_ADDRESS_LINE3,
                        VC_LOCALITY: req.body.VC_LOCALITY,
                        I_PINCODE: req.body.I_PINCODE,
                        VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                        VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                        VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                        TS_INFORMANT_DATE: req.body.TS_INFORMANT_DATE,
                        VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                        VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                        VC_INFORMANT_MOBILE_NUMBER: req.body.VC_INFORMANT_MOBILE_NUMBER,
                        VC_INFORMANT_EMAILID: req.body.VC_INFORMANT_EMAILID,
                        VC_TOWN_OR_VILLAGE: req.body.VC_TOWN_OR_VILLAGE,
                        VC_NAME_OF_TOWN_OR_VILLAGE: req.body.VC_NAME_OF_TOWN_OR_VILLAGE,
                        VC_STATE: req.body.VC_STATE,
                        VC_DISTRICT: req.body.VC_DISTRICT,
                        VC_MANDAL: req.body.VC_MANDAL,
                        I_DELIVERY_AGE: req.body.I_DELIVERY_AGE,
                        VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                        VC_ATTENTION_DELIVERY: req.body.VC_ATTENTION_DELIVERY,
                        I_DURATION_OF_PREGNANCY: req.body.I_DURATION_OF_PREGNANCY,
                        VC_CAUSE_OF_TOTAL_DEATH: req.body.VC_CAUSE_OF_TOTAL_DEATH,
                        VC_ENCLOUSER: req.body.VC_ENCLOUSER,
                        VC_IMAGE_URL: req.body.VC_IMAGE_URL,
                        VC_REMARKS: req.body.VC_REMARKS,
                        I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                        I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                        VC_CREATED_IP: req.body.VC_CREATED_IP,
                        VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                        I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                        VC_STATUS: req.body.VC_STATUS,
                        VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                        VC_MC_STATUS: req.body.VC_MC_STATUS,
                        VC_SI_STATUS: req.body.VC_SI_STATUS,
                        VC_SI_REMARKS: req.body.VC_SI_REMARKS,
                        ULB_STATUS: req.body.ULB_STATUS,
                        ULB_REMARKS: req.body.ULB_REMARKS,
                        CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                        IS_BACKLOG: req.body.IS_BACKLOG,
                        REG_NO: req.body.REG_NO,
                        VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                        VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                        VC_NATIONALITY: req.body.VC_NATIONALITY,
                        FORM_UPLOAD3: req.body.FORM_UPLOAD3,
                        VC_HASHKEY: req.body.VC_HASHKEY,
                        TS_DTTM: req.body.TS_DTTM,
                        VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                        VC_MAGISTRATEORDER: req.body.VC_MAGISTRATEORDER,
                        I_GENDER_ID: req.body.I_GENDER_ID,
                        I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                        I_STATE_ID: req.body.I_STATE_ID,
                        I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                        I_MOTHER_LITERACY_ID: req.body.I_MOTHER_LITERACY_ID,
                        I_DELIVERY_TYPE_ID: req.body.I_DELIVERY_TYPE_ID,
                        I_CAUSE_OF_DEATH_ID: req.body.I_CAUSE_OF_DEATH_ID,
                        I_LOCALITY_ID: req.body.I_LOCALITY_ID,
                        VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                        TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                        TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                        C_DELFLAG: req.body.C_DELFLAG,
                        REG_YEAR: req.body.REG_YEAR,
                        TS_REG_DATE: req.body.TS_REG_DATE
                    },

                }


                return res.status(400).json({
                    status: 400,
                    success: true,
                    message: "still birth certificate not verified",
                    data: data
                })

            } else {

                let data = {
                    key: id,
                    old_key: req.body.Key,
                    // tx_id: message,
                    Record: {
                        I_STILL_BIRTH_ID: req.body.I_STILL_BIRTH_ID,
                        TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                        I_ULBOBJID: req.body.I_ULBOBJID,
                        docType: "stillbirthCert",
                        VC_GENDER: req.body.VC_GENDER,
                        VC_FATHER_SURNAME: req.body.VC_FATHER_SURNAME,
                        VC_FATHER_NAME: req.body.VC_FATHER_NAME,
                        VC_FATHER_AADHAR: req.body.VC_FATHER_AADHAR,
                        VC_MOTHER_SURNAME: req.body.VC_MOTHER_SURNAME,
                        VC_MOTHER_NAME: req.body.VC_MOTHER_NAME,
                        VC_MOTHER_AADHAR: req.body.VC_MOTHER_AADHAR,
                        VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                        VC_HOSPITAL_NAME: req.body.VC_HOSPITAL_NAME,
                        VC_ADDRESS_LINE1: req.body.VC_ADDRESS_LINE1,
                        VC_ADDRESS_LINE2: req.body.VC_ADDRESS_LINE2,
                        VC_ADDRESS_LINE3: req.body.VC_ADDRESS_LINE3,
                        VC_LOCALITY: req.body.VC_LOCALITY,
                        I_PINCODE: req.body.I_PINCODE,
                        VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                        VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                        VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                        TS_INFORMANT_DATE: req.body.TS_INFORMANT_DATE,
                        VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                        VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                        VC_INFORMANT_MOBILE_NUMBER: req.body.VC_INFORMANT_MOBILE_NUMBER,
                        VC_INFORMANT_EMAILID: req.body.VC_INFORMANT_EMAILID,
                        VC_TOWN_OR_VILLAGE: req.body.VC_TOWN_OR_VILLAGE,
                        VC_NAME_OF_TOWN_OR_VILLAGE: req.body.VC_NAME_OF_TOWN_OR_VILLAGE,
                        VC_STATE: req.body.VC_STATE,
                        VC_DISTRICT: req.body.VC_DISTRICT,
                        VC_MANDAL: req.body.VC_MANDAL,
                        I_DELIVERY_AGE: req.body.I_DELIVERY_AGE,
                        VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                        VC_ATTENTION_DELIVERY: req.body.VC_ATTENTION_DELIVERY,
                        I_DURATION_OF_PREGNANCY: req.body.I_DURATION_OF_PREGNANCY,
                        VC_CAUSE_OF_TOTAL_DEATH: req.body.VC_CAUSE_OF_TOTAL_DEATH,
                        VC_ENCLOUSER: req.body.VC_ENCLOUSER,
                        VC_IMAGE_URL: req.body.VC_IMAGE_URL,
                        VC_REMARKS: req.body.VC_REMARKS,
                        I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                        I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                        VC_CREATED_IP: req.body.VC_CREATED_IP,
                        VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                        I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                        VC_STATUS: req.body.VC_STATUS,
                        VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                        VC_MC_STATUS: req.body.VC_MC_STATUS,
                        VC_SI_STATUS: req.body.VC_SI_STATUS,
                        VC_SI_REMARKS: req.body.VC_SI_REMARKS,
                        ULB_STATUS: req.body.ULB_STATUS,
                        ULB_REMARKS: req.body.ULB_REMARKS,
                        CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                        IS_BACKLOG: req.body.IS_BACKLOG,
                        REG_NO: req.body.REG_NO,
                        VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                        VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                        VC_NATIONALITY: req.body.VC_NATIONALITY,
                        FORM_UPLOAD3: req.body.FORM_UPLOAD3,
                        VC_HASHKEY: req.body.VC_HASHKEY,
                        TS_DTTM: req.body.TS_DTTM,
                        VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                        VC_MAGISTRATEORDER: req.body.VC_MAGISTRATEORDER,
                        I_GENDER_ID: req.body.I_GENDER_ID,
                        I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                        I_STATE_ID: req.body.I_STATE_ID,
                        I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                        I_MOTHER_LITERACY_ID: req.body.I_MOTHER_LITERACY_ID,
                        I_DELIVERY_TYPE_ID: req.body.I_DELIVERY_TYPE_ID,
                        I_CAUSE_OF_DEATH_ID: req.body.I_CAUSE_OF_DEATH_ID,
                        I_LOCALITY_ID: req.body.I_LOCALITY_ID,
                        VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                        TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                        TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                        C_DELFLAG: req.body.C_DELFLAG,
                        REG_YEAR: req.body.REG_YEAR,
                        TS_REG_DATE: req.body.TS_REG_DATE
                        },

                }
               

                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "still birth certificate verified and updated successfully!",
                    data: data
                })
            }


        }

        return res.status(400).json({
            status: 400,
            success: false,
            message: "still birth certificate not verified",
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
        var chaincodeName = "stillbirthcert";
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
            message: "All stillbirth certificate found successfully",
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
        var chaincodeName = "stillbirthcert";
        let args = req.query.args;;
        let fcn = 'getStillbirthCert';

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
