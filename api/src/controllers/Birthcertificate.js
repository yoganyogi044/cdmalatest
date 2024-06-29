const {
    body,
    check,
    sanitize,
    validationResult,
} = require("express-validator");
const generateUniqueId = require("generate-unique-id");
const _BirthCertModel = require("../models/BirthCertificateModel");
const invoke = require("../../app/invoke-transaction.js");
const query = require("../../app/query.js");
var log4js = require("log4js");
const date = require("date-and-time");
const XLSX = require("xlsx");
var logger = log4js.getLogger("SampleWebApp");
// const UserModel = require("../models/Birth");
require("../../config.js");
const prometheus = require("prom-client");

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PROMETHEUS METRICS CONFIGURATION /////////////
///////////////////////////////////////////////////////////////////////////////
const writeLatencyGauge = new prometheus.Gauge({
    name: "write_latency",
    help: "latency for write requests",
});
const requestCountGauge = new prometheus.Gauge({
    name: "request_count",
    help: "requests count",
});
const readLatencyGauge = new prometheus.Gauge({
    name: "read_latency",
    help: "latency for read requests",
});
const queriesCountGauge = new prometheus.Gauge({
    name: "queries_count",
    help: "queries count",
});
const totalTransaction = new prometheus.Gauge({
    name: "total_transaction",
    help: "Counter for total transaction",
});
const failedTransaction = new prometheus.Gauge({
    name: "failed_transaction",
    help: "Counter for failed transaction",
});
const successfulTransaction = new prometheus.Gauge({
    name: "successful_transaction",
    help: "counter for successful transaction",
});

async function store(req, res, next) {
    try {
        await check("BIRTH_ID")
            .notEmpty()
            .withMessage("BIRTH_ID must be required")
            .run(req);

        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "birthcert";
        var channelName = "mychannel";
        var fcn = "createBirthCert";

        var args = [];
        const id = generateUniqueId({ length: 64 });

        args.push(
            req.body.BIRTH_ID,
            id,
            req.body.TS_DATE_OF_BIRTH,
            req.body.I_ULBOBJID,
            req.body.VC_SEX,
            req.body.VC_SURNAMECHILD,
            req.body.VC_NAME_CHILD,
            req.body.VC_AADHAR_NO,
            req.body.VC_SURNAME_FATHER,
            req.body.VC_NAME_FATHER,
            req.body.VC_AADHAR_NO_FATHER,
            req.body.VC_SURNAME_MOTHER,
            req.body.VC_NAME_MOTHER,
            req.body.VC_AADHAR_NO_MOTHER,
            req.body.VC_PLACE_OF_BIRTH,
            req.body.I_HOSPITAL_ID,
            req.body.VC_ADDRESS_LINE_1,
            req.body.VC_ADDRESS_LINE_2,
            req.body.VC_ADDRESS_LINE_3,
            req.body.VC_PIN_CODE,
            req.body.VC_ADDRESS_PARENT,
            req.body.VC_PERMANENT_ADDRESS_PARENT,
            req.body.VC_INFORMANT_SURNAME,
            req.body.VC_INFORMANT_NAME,
            req.body.VC_INFORMANT_ADDRESS,
            req.body.TS_INFORMED_DATE,
            req.body.VC_INFORMANT_SIGN,
            req.body.VC_INFORMANT_REMARKS,
            req.body.VC_MOBILE_NUMBER,
            req.body.VC_EMAIL_ID,
            req.body.VC_RESIDENCE,
            req.body.VC_NAME_TOWN,
            req.body.VC_NAME_MANDAL,
            req.body.VC_NAME_DISTRICT,
            req.body.VC_NAME_STATE,
            req.body.VC_RELIGION,
            req.body.VC_FATHER_LITERACY,
            req.body.VC_MOTHER_LITERACY,
            req.body.VC_FATHER_OCCUPATION,
            req.body.VC_MOTHER_OCCUPATION,
            req.body.VC_AGE_MOTHER,
            req.body.VC_AGE_MOTHER_DELIVERY,
            req.body.VC_NO_CHILD,
            req.body.VC_MEDICAL_ATTENTION,
            req.body.VC_DELIVERY_TYPE,
            req.body.VC_PREGNANCY_DURATION,
            req.body.VC_AFFIDAVIT,
            req.body.VC_NONAVAILABILITY,
            req.body.VC_MAGISTRATE_ORDER,
            req.body.VC_REMARKS,
            req.body.C_DELFLAG,
            req.body.TS_DTTM,
            req.body.I_CERATED_BY_ID,
            req.body.TS_CREATED_TIME,
            req.body.I_MODIFIED_BY_ID,
            req.body.TS_MODIFIED_TIME,
            req.body.VC_CREATED_IP,
            req.body.VC_MODIFIED_IP,
            req.body.I_APP_RECEIVED_ID,
            req.body.VC_STATUS,
            req.body.VC_MC_REMARKS,
            req.body.VC_ULB_VERIFIED,
            req.body.VC_CSC_REMARKS,
            req.body.REG_YEAR,
            req.body.TS_REG_DATE,
            req.body.TS_MC_APPROVED_DATE,
            req.body.I_LOCALITY,
            req.body.VC_CERT_NO,
            req.body.VC_COURT_CASE_NO,
            req.body.VC_REG_DESIGNATION,
            req.body.VC_REG_REMARKS,
            req.body.V_REG_SIGN,
            req.body.VC_HASHKEY,
            req.body.REG_NO,
            req.body.TS_MC_APPROVED_DT,
            req.body.ULB_STATUS,
            req.body.ULB_REMARKS,
            req.body.SI_REMARKS,
            req.body.MC_STATUS,
            req.body.MC_REMARKS,
            req.body.SI_STATUS,
            req.body.BIRTH_TYPE,
            req.body.VC_STATUS_DT,
            req.body.VC_ULB_STATUS_DT,
            req.body.VC_SI_STATUS_DT,
            req.body.VC_MC_STATUS_DT,
            req.body.CITIZEN_ENT_ID,
            req.body.I_DISTRICT_ID,
            req.body.I_MANDAL_ID,
            req.body.I_FAT_LITERACY_ID,
            req.body.I_MOT_LITERACY_ID,
            req.body.I_FAT_OCC_ID,
            req.body.I_MOT_OCC_ID,
            req.body.I_RELIGION_ID,
            req.body.I_DELIVERYTYPE_ID,
	    req.body.I_ATTENBIRTH_ID,
            req.body.FORM_UPLOAD1,
            req.body.VC_COUNTRY_NAME,
            req.body.VC_COUNTRY_ADDRESS,
            req.body.VC_NATIONALITY,
            req.body.IS_BACKLOG,
            req.body.VC_CHILDWEIGHT,
            req.body.VC_SUPPORTING_DOC
        );

        const start = Date.now();
        let message = await invoke.invokeChaincode(
            "admin",
            channelName,
            chaincodeName,
            fcn,
            args
        );

        let getUser = await query.queryChaincode(
            "admin",
            channelName,
            chaincodeName,
            "getBirthCert",
            [req.body.BIRTH_ID, id]
        );
        console.log(
            "ghfghgfhfgh",
            peers,
            channelName,
            chaincodeName,
            fcn,
            args,
            "admin",
            "Org1"
        );
        console.log("getUser...................", getUser);
        console.log("message", message);
        const latency = Date.now() - start;
        if (typeof message != "string") {
            let data = {
                key: id,
                // tx_id: message,
                Record: {
                    BIRTH_ID: req.body.BIRTH_ID,
                    TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                    I_ULBOBJID: req.body.I_ULBOBJID,
                    VC_SEX: req.body.VC_SEX,
                    VC_SURNAMECHILD: req.body.VC_SURNAMECHILD,
                    VC_NAME_CHILD: req.body.VC_NAME_CHILD,
                    VC_AADHAR_NO: req.body.VC_AADHAR_NO,
                    VC_SURNAME_FATHER: req.body.VC_SURNAME_FATHER,
                    VC_NAME_FATHER: req.body.VC_NAME_FATHER,
                    VC_AADHAR_NO_FATHER: req.body.VC_AADHAR_NO_FATHER,
                    VC_SURNAME_MOTHER: req.body.VC_SURNAME_MOTHER,
                    VC_NAME_MOTHER: req.body.VC_NAME_MOTHER,
                    VC_AADHAR_NO_MOTHER: req.body.VC_AADHAR_NO_MOTHER,
                    VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                    I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                    VC_ADDRESS_LINE_1: req.body.VC_ADDRESS_LINE_1,
                    VC_ADDRESS_LINE_2: req.body.VC_ADDRESS_LINE_2,
                    VC_ADDRESS_LINE_3: req.body.VC_ADDRESS_LINE_3,
                    VC_PIN_CODE: req.body.VC_PIN_CODE,
                    VC_ADDRESS_PARENT: req.body.VC_ADDRESS_PARENT,
                    VC_PERMANENT_ADDRESS_PARENT:
                        req.body.VC_PERMANENT_ADDRESS_PARENT,
                    VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                    VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                    VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                    TS_INFORMED_DATE: req.body.TS_INFORMED_DATE,
                    VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                    VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                    VC_MOBILE_NUMBER: req.body.VC_MOBILE_NUMBER,
                    VC_EMAIL_ID: req.body.VC_EMAIL_ID,
                    VC_RESIDENCE: req.body.VC_RESIDENCE,
                    VC_NAME_TOWN: req.body.VC_NAME_TOWN,
                    VC_NAME_MANDAL: req.body.VC_NAME_MANDAL,
                    VC_NAME_DISTRICT: req.body.VC_NAME_DISTRICT,
                    VC_NAME_STATE: req.body.VC_NAME_STATE,
                    VC_RELIGION: req.body.VC_RELIGION,
                    VC_FATHER_LITERACY: req.body.VC_FATHER_LITERACY,
                    VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                    VC_FATHER_OCCUPATION: req.body.VC_FATHER_OCCUPATION,
                    VC_MOTHER_OCCUPATION: req.body.VC_MOTHER_OCCUPATION,
                    VC_AGE_MOTHER: req.body.VC_AGE_MOTHER,
                    VC_AGE_MOTHER_DELIVERY: req.body.VC_AGE_MOTHER_DELIVERY,
                    VC_NO_CHILD: req.body.VC_NO_CHILD,
                    VC_MEDICAL_ATTENTION: req.body.VC_MEDICAL_ATTENTION,
                    VC_DELIVERY_TYPE: req.body.VC_DELIVERY_TYPE,
                    VC_PREGNANCY_DURATION: req.body.VC_PREGNANCY_DURATION,
                    VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                    VC_NONAVAILABILITY: req.body.VC_NONAVAILABILITY,
                    VC_MAGISTRATE_ORDER: req.body.VC_MAGISTRATE_ORDER,
                    VC_REMARKS: req.body.VC_REMARKS,
                    C_DELFLAG: req.body.C_DELFLAG,
                    TS_DTTM: req.body.TS_DTTM,
                    I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                    TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                    I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                    TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                    VC_CREATED_IP: req.body.VC_CREATED_IP,
                    VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                    I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                    VC_STATUS: req.body.VC_STATUS,
                    VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                    VC_ULB_VERIFIED: req.body.VC_ULB_VERIFIED,
                    VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                    REG_YEAR: req.body.REG_YEAR,
                    TS_REG_DATE: req.body.TS_REG_DATE,
                    TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                    I_LOCALITY: req.body.I_LOCALITY,
                    VC_CERT_NO: req.body.VC_CERT_NO,
                    VC_COURT_CASE_NO: req.body.VC_COURT_CASE_NO,
                    VC_REG_DESIGNATION: req.body.VC_REG_DESIGNATION,
                    VC_REG_REMARKS: req.body.VC_REG_REMARKS,
                    V_REG_SIGN: req.body.V_REG_SIGN,
                    VC_HASHKEY: req.body.VC_HASHKEY,
                    REG_NO: req.body.REG_NO,
                    TS_MC_APPROVED_DT: req.body.TS_MC_APPROVED_DT,
                    ULB_STATUS: req.body.ULB_STATUS,
                    ULB_REMARKS: req.body.ULB_REMARKS,
                    SI_REMARKS: req.body.SI_REMARKS,
                    MC_STATUS: req.body.MC_STATUS,
                    MC_REMARKS: req.body.MC_REMARKS,
                    SI_STATUS: req.body.SI_STATUS,
                    BIRTH_TYPE: req.body.BIRTH_TYPE,
                    VC_STATUS_DT: req.body.VC_STATUS_DT,
                    VC_ULB_STATUS_DT: req.body.VC_ULB_STATUS_DT,
                    VC_SI_STATUS_DT: req.body.VC_SI_STATUS_DT,
                    VC_MC_STATUS_DT: req.body.VC_MC_STATUS_DT,
                    CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                    I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                    I_MANDAL_ID: req.body.I_MANDAL_ID,
                    I_FAT_LITERACY_ID: req.body.I_FAT_LITERACY_ID,
                    I_MOT_LITERACY_ID: req.body.I_MOT_LITERACY_ID,
                    I_FAT_OCC_ID: req.body.I_FAT_OCC_ID,
                    I_MOT_OCC_ID: req.body.I_MOT_OCC_ID,
                    I_RELIGION_ID: req.body.I_RELIGION_ID,
                    I_DELIVERYTYPE_ID: req.body.I_DELIVERYTYPE_ID,
		    I_ATTENBIRTH_ID: req.body.I_ATTENBIRTH_ID,
                    FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                    VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                    VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                    VC_NATIONALITY: req.body.VC_NATIONALITY,
                    IS_BACKLOG: req.body.IS_BACKLOG,
                    VC_CHILDWEIGHT: req.body.VC_CHILDWEIGHT,
                    VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                },
            };

            writeLatencyGauge.inc(latency);
            requestCountGauge.inc();
            successfulTransaction.inc();
            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(400).json({
                status: 400,
                success: false,
                message: "Birthday certificate not inserte!",
                data: data,
            });
        } else {
            let data = {
                key: id,
                // tx_id: message,
                Record: {
                    BIRTH_ID: req.body.BIRTH_ID,
                    TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                    I_ULBOBJID: req.body.I_ULBOBJID,
                    VC_SEX: req.body.VC_SEX,
                    VC_SURNAMECHILD: req.body.VC_SURNAMECHILD,
                    VC_NAME_CHILD: req.body.VC_NAME_CHILD,
                    VC_AADHAR_NO: req.body.VC_AADHAR_NO,
                    VC_SURNAME_FATHER: req.body.VC_SURNAME_FATHER,
                    VC_NAME_FATHER: req.body.VC_NAME_FATHER,
                    VC_AADHAR_NO_FATHER: req.body.VC_AADHAR_NO_FATHER,
                    VC_SURNAME_MOTHER: req.body.VC_SURNAME_MOTHER,
                    VC_NAME_MOTHER: req.body.VC_NAME_MOTHER,
                    VC_AADHAR_NO_MOTHER: req.body.VC_AADHAR_NO_MOTHER,
                    VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                    I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                    VC_ADDRESS_LINE_1: req.body.VC_ADDRESS_LINE_1,
                    VC_ADDRESS_LINE_2: req.body.VC_ADDRESS_LINE_2,
                    VC_ADDRESS_LINE_3: req.body.VC_ADDRESS_LINE_3,
                    VC_PIN_CODE: req.body.VC_PIN_CODE,
                    VC_ADDRESS_PARENT: req.body.VC_ADDRESS_PARENT,
                    VC_PERMANENT_ADDRESS_PARENT:
                        req.body.VC_PERMANENT_ADDRESS_PARENT,
                    VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                    VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                    VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                    TS_INFORMED_DATE: req.body.TS_INFORMED_DATE,
                    VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                    VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                    VC_MOBILE_NUMBER: req.body.VC_MOBILE_NUMBER,
                    VC_EMAIL_ID: req.body.VC_EMAIL_ID,
                    VC_RESIDENCE: req.body.VC_RESIDENCE,
                    VC_NAME_TOWN: req.body.VC_NAME_TOWN,
                    VC_NAME_MANDAL: req.body.VC_NAME_MANDAL,
                    VC_NAME_DISTRICT: req.body.VC_NAME_DISTRICT,
                    VC_NAME_STATE: req.body.VC_NAME_STATE,
                    VC_RELIGION: req.body.VC_RELIGION,
                    VC_FATHER_LITERACY: req.body.VC_FATHER_LITERACY,
                    VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                    VC_FATHER_OCCUPATION: req.body.VC_FATHER_OCCUPATION,
                    VC_MOTHER_OCCUPATION: req.body.VC_MOTHER_OCCUPATION,
                    VC_AGE_MOTHER: req.body.VC_AGE_MOTHER,
                    VC_AGE_MOTHER_DELIVERY: req.body.VC_AGE_MOTHER_DELIVERY,
                    VC_NO_CHILD: req.body.VC_NO_CHILD,
                    VC_MEDICAL_ATTENTION: req.body.VC_MEDICAL_ATTENTION,
                    VC_DELIVERY_TYPE: req.body.VC_DELIVERY_TYPE,
                    VC_PREGNANCY_DURATION: req.body.VC_PREGNANCY_DURATION,
                    VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                    VC_NONAVAILABILITY: req.body.VC_NONAVAILABILITY,
                    VC_MAGISTRATE_ORDER: req.body.VC_MAGISTRATE_ORDER,
                    VC_REMARKS: req.body.VC_REMARKS,
                    C_DELFLAG: req.body.C_DELFLAG,
                    TS_DTTM: req.body.TS_DTTM,
                    I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                    TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                    I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                    TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                    VC_CREATED_IP: req.body.VC_CREATED_IP,
                    VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                    I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                    VC_STATUS: req.body.VC_STATUS,
                    VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                    VC_ULB_VERIFIED: req.body.VC_ULB_VERIFIED,
                    VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                    REG_YEAR: req.body.REG_YEAR,
                    TS_REG_DATE: req.body.TS_REG_DATE,
                    TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                    I_LOCALITY: req.body.I_LOCALITY,
                    VC_CERT_NO: req.body.VC_CERT_NO,
                    VC_COURT_CASE_NO: req.body.VC_COURT_CASE_NO,
                    VC_REG_DESIGNATION: req.body.VC_REG_DESIGNATION,
                    VC_REG_REMARKS: req.body.VC_REG_REMARKS,
                    V_REG_SIGN: req.body.V_REG_SIGN,
                    VC_HASHKEY: req.body.VC_HASHKEY,
                    REG_NO: req.body.REG_NO,
                    TS_MC_APPROVED_DT: req.body.TS_MC_APPROVED_DT,
                    ULB_STATUS: req.body.ULB_STATUS,
                    ULB_REMARKS: req.body.ULB_REMARKS,
                    SI_REMARKS: req.body.SI_REMARKS,
                    MC_STATUS: req.body.MC_STATUS,
                    MC_REMARKS: req.body.MC_REMARKS,
                    SI_STATUS: req.body.SI_STATUS,
                    BIRTH_TYPE: req.body.BIRTH_TYPE,
                    VC_STATUS_DT: req.body.VC_STATUS_DT,
                    VC_ULB_STATUS_DT: req.body.VC_ULB_STATUS_DT,
                    VC_SI_STATUS_DT: req.body.VC_SI_STATUS_DT,
                    VC_MC_STATUS_DT: req.body.VC_MC_STATUS_DT,
                    CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                    I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                    I_MANDAL_ID: req.body.I_MANDAL_ID,
                    I_FAT_LITERACY_ID: req.body.I_FAT_LITERACY_ID,
                    I_MOT_LITERACY_ID: req.body.I_MOT_LITERACY_ID,
                    I_FAT_OCC_ID: req.body.I_FAT_OCC_ID,
                    I_MOT_OCC_ID: req.body.I_MOT_OCC_ID,
                    I_RELIGION_ID: req.body.I_RELIGION_ID,
                    I_DELIVERYTYPE_ID: req.body.I_DELIVERYTYPE_ID,
		    I_ATTENBIRTH_ID: req.body.I_ATTENBIRTH_ID,
                    FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                    VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                    VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                    VC_NATIONALITY: req.body.VC_NATIONALITY,
                    IS_BACKLOG: req.body.IS_BACKLOG,
                    VC_CHILDWEIGHT: req.body.VC_CHILDWEIGHT,
                    VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                },
            };

            _BirthCertModel.create({
                Key: id,
                TransactionID: message,
                BIRTH_ID: req.body.BIRTH_ID,
                TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                I_ULBOBJID: req.body.I_ULBOBJID,
                VC_SEX: req.body.VC_SEX,
                VC_SURNAMECHILD: req.body.VC_SURNAMECHILD,
                VC_NAME_CHILD: req.body.VC_NAME_CHILD,
                VC_AADHAR_NO: req.body.VC_AADHAR_NO,
                VC_SURNAME_FATHER: req.body.VC_SURNAME_FATHER,
                VC_NAME_FATHER: req.body.VC_NAME_FATHER,
                VC_AADHAR_NO_FATHER: req.body.VC_AADHAR_NO_FATHER,
                VC_SURNAME_MOTHER: req.body.VC_SURNAME_MOTHER,
                VC_NAME_MOTHER: req.body.VC_NAME_MOTHER,
                VC_AADHAR_NO_MOTHER: req.body.VC_AADHAR_NO_MOTHER,
                VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                VC_ADDRESS_LINE_1: req.body.VC_ADDRESS_LINE_1,
                VC_ADDRESS_LINE_2: req.body.VC_ADDRESS_LINE_2,
                VC_ADDRESS_LINE_3: req.body.VC_ADDRESS_LINE_3,
                VC_PIN_CODE: req.body.VC_PIN_CODE,
                VC_ADDRESS_PARENT: req.body.VC_ADDRESS_PARENT,
                VC_PERMANENT_ADDRESS_PARENT:
                    req.body.VC_PERMANENT_ADDRESS_PARENT,
                VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                TS_INFORMED_DATE: req.body.TS_INFORMED_DATE,
                VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                VC_MOBILE_NUMBER: req.body.VC_MOBILE_NUMBER,
                VC_EMAIL_ID: req.body.VC_EMAIL_ID,
                VC_RESIDENCE: req.body.VC_RESIDENCE,
                VC_NAME_TOWN: req.body.VC_NAME_TOWN,
                VC_NAME_MANDAL: req.body.VC_NAME_MANDAL,
                VC_NAME_DISTRICT: req.body.VC_NAME_DISTRICT,
                VC_NAME_STATE: req.body.VC_NAME_STATE,
                VC_RELIGION: req.body.VC_RELIGION,
                VC_FATHER_LITERACY: req.body.VC_FATHER_LITERACY,
                VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                VC_FATHER_OCCUPATION: req.body.VC_FATHER_OCCUPATION,
                VC_MOTHER_OCCUPATION: req.body.VC_MOTHER_OCCUPATION,
                VC_AGE_MOTHER: req.body.VC_AGE_MOTHER,
                VC_AGE_MOTHER_DELIVERY: req.body.VC_AGE_MOTHER_DELIVERY,
                VC_NO_CHILD: req.body.VC_NO_CHILD,
                VC_MEDICAL_ATTENTION: req.body.VC_MEDICAL_ATTENTION,
                VC_DELIVERY_TYPE: req.body.VC_DELIVERY_TYPE,
                VC_PREGNANCY_DURATION: req.body.VC_PREGNANCY_DURATION,
                VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                VC_NONAVAILABILITY: req.body.VC_NONAVAILABILITY,
                VC_MAGISTRATE_ORDER: req.body.VC_MAGISTRATE_ORDER,
                VC_REMARKS: req.body.VC_REMARKS,
                C_DELFLAG: req.body.C_DELFLAG,
                TS_DTTM: req.body.TS_DTTM,
                I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                VC_CREATED_IP: req.body.VC_CREATED_IP,
                VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                VC_STATUS: req.body.VC_STATUS,
                VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                VC_ULB_VERIFIED: req.body.VC_ULB_VERIFIED,
                VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                REG_YEAR: req.body.REG_YEAR,
                TS_REG_DATE: req.body.TS_REG_DATE,
                TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                I_LOCALITY: req.body.I_LOCALITY,
                VC_CERT_NO: req.body.VC_CERT_NO,
                VC_COURT_CASE_NO: req.body.VC_COURT_CASE_NO,
                VC_REG_DESIGNATION: req.body.VC_REG_DESIGNATION,
                VC_REG_REMARKS: req.body.VC_REG_REMARKS,
                V_REG_SIGN: req.body.V_REG_SIGN,
                VC_HASHKEY: req.body.VC_HASHKEY,
                REG_NO: req.body.REG_NO,
                TS_MC_APPROVED_DT: req.body.TS_MC_APPROVED_DT,
                ULB_STATUS: req.body.ULB_STATUS,
                ULB_REMARKS: req.body.ULB_REMARKS,
                SI_REMARKS: req.body.SI_REMARKS,
                MC_STATUS: req.body.MC_STATUS,
                MC_REMARKS: req.body.MC_REMARKS,
                SI_STATUS: req.body.SI_STATUS,
                BIRTH_TYPE: req.body.BIRTH_TYPE,
                VC_STATUS_DT: req.body.VC_STATUS_DT,
                VC_ULB_STATUS_DT: req.body.VC_ULB_STATUS_DT,
                VC_SI_STATUS_DT: req.body.VC_SI_STATUS_DT,
                VC_MC_STATUS_DT: req.body.VC_MC_STATUS_DT,
                CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                I_MANDAL_ID: req.body.I_MANDAL_ID,
                I_FAT_LITERACY_ID: req.body.I_FAT_LITERACY_ID,
                I_MOT_LITERACY_ID: req.body.I_MOT_LITERACY_ID,
                I_FAT_OCC_ID: req.body.I_FAT_OCC_ID,
                I_MOT_OCC_ID: req.body.I_MOT_OCC_ID,
                I_RELIGION_ID: req.body.I_RELIGION_ID,
                I_DELIVERYTYPE_ID: req.body.I_DELIVERYTYPE_ID,
		I_ATTENBIRTH_ID: req.body.I_ATTENBIRTH_ID,
                FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                VC_NATIONALITY: req.body.VC_NATIONALITY,
                IS_BACKLOG: req.body.IS_BACKLOG,
                VC_CHILDWEIGHT: req.body.VC_CHILDWEIGHT,
                VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
            });

            writeLatencyGauge.inc(latency);
            requestCountGauge.inc();
            successfulTransaction.inc();
            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Birth certificate inserted successfully!",
                data: data,
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message,
        });
    }
}

async function update(req, res, next) {
    try {
        await check("BIRTH_ID")
            .notEmpty()
            .withMessage("BIRTH_ID must be required")
            .run(req);
        await check("Key")
            .notEmpty()
            .withMessage("Key must be required")
            .run(req);

        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "birthcert";
        var channelName = "mychannel";
        var fcn = "createBirthCert";

        let oldData = await query.queryChaincode(
            "admin",
            channelName,
            chaincodeName,
            "getBirthCert",
            [req.body.BIRTH_ID, req.body.Key]
        );

        if (typeof oldData != "object") {
            var args = [];
            const id = generateUniqueId({ length: 64 });

            args.push(
                req.body.BIRTH_ID,
                id,
                req.body.TS_DATE_OF_BIRTH,
                req.body.I_ULBOBJID,
                req.body.VC_SEX,
                req.body.VC_SURNAMECHILD,
                req.body.VC_NAME_CHILD,
                req.body.VC_AADHAR_NO,
                req.body.VC_SURNAME_FATHER,
                req.body.VC_NAME_FATHER,
                req.body.VC_AADHAR_NO_FATHER,
                req.body.VC_SURNAME_MOTHER,
                req.body.VC_NAME_MOTHER,
                req.body.VC_AADHAR_NO_MOTHER,
                req.body.VC_PLACE_OF_BIRTH,
                req.body.I_HOSPITAL_ID,
                req.body.VC_ADDRESS_LINE_1,
                req.body.VC_ADDRESS_LINE_2,
                req.body.VC_ADDRESS_LINE_3,
                req.body.VC_PIN_CODE,
                req.body.VC_ADDRESS_PARENT,
                req.body.VC_PERMANENT_ADDRESS_PARENT,
                req.body.VC_INFORMANT_SURNAME,
                req.body.VC_INFORMANT_NAME,
                req.body.VC_INFORMANT_ADDRESS,
                req.body.TS_INFORMED_DATE,
                req.body.VC_INFORMANT_SIGN,
                req.body.VC_INFORMANT_REMARKS,
                req.body.VC_MOBILE_NUMBER,
                req.body.VC_EMAIL_ID,
                req.body.VC_RESIDENCE,
                req.body.VC_NAME_TOWN,
                req.body.VC_NAME_MANDAL,
                req.body.VC_NAME_DISTRICT,
                req.body.VC_NAME_STATE,
                req.body.VC_RELIGION,
                req.body.VC_FATHER_LITERACY,
                req.body.VC_MOTHER_LITERACY,
                req.body.VC_FATHER_OCCUPATION,
                req.body.VC_MOTHER_OCCUPATION,
                req.body.VC_AGE_MOTHER,
                req.body.VC_AGE_MOTHER_DELIVERY,
                req.body.VC_NO_CHILD,
                req.body.VC_MEDICAL_ATTENTION,
                req.body.VC_DELIVERY_TYPE,
                req.body.VC_PREGNANCY_DURATION,
                req.body.VC_AFFIDAVIT,
                req.body.VC_NONAVAILABILITY,
                req.body.VC_MAGISTRATE_ORDER,
                req.body.VC_REMARKS,
                req.body.C_DELFLAG,
                req.body.TS_DTTM,
                req.body.I_CERATED_BY_ID,
                req.body.TS_CREATED_TIME,
                req.body.I_MODIFIED_BY_ID,
                req.body.TS_MODIFIED_TIME,
                req.body.VC_CREATED_IP,
                req.body.VC_MODIFIED_IP,
                req.body.I_APP_RECEIVED_ID,
                req.body.VC_STATUS,
                req.body.VC_MC_REMARKS,
                req.body.VC_ULB_VERIFIED,
                req.body.VC_CSC_REMARKS,
                req.body.REG_YEAR,
                req.body.TS_REG_DATE,
                req.body.TS_MC_APPROVED_DATE,
                req.body.I_LOCALITY,
                req.body.VC_CERT_NO,
                req.body.VC_COURT_CASE_NO,
                req.body.VC_REG_DESIGNATION,
                req.body.VC_REG_REMARKS,
                req.body.V_REG_SIGN,
                req.body.VC_HASHKEY,
                req.body.REG_NO,
                req.body.TS_MC_APPROVED_DT,
                req.body.ULB_STATUS,
                req.body.ULB_REMARKS,
                req.body.SI_REMARKS,
                req.body.MC_STATUS,
                req.body.MC_REMARKS,
                req.body.SI_STATUS,
                req.body.BIRTH_TYPE,
                req.body.VC_STATUS_DT,
                req.body.VC_ULB_STATUS_DT,
                req.body.VC_SI_STATUS_DT,
                req.body.VC_MC_STATUS_DT,
                req.body.CITIZEN_ENT_ID,
                req.body.I_DISTRICT_ID,
                req.body.I_MANDAL_ID,
                req.body.I_FAT_LITERACY_ID,
                req.body.I_MOT_LITERACY_ID,
                req.body.I_FAT_OCC_ID,
                req.body.I_MOT_OCC_ID,
                req.body.I_RELIGION_ID,
                req.body.I_DELIVERYTYPE_ID,
		req.body.I_ATTENBIRTH_ID,
                req.body.FORM_UPLOAD1,
                req.body.VC_COUNTRY_NAME,
                req.body.VC_COUNTRY_ADDRESS,
                req.body.VC_NATIONALITY,
                req.body.IS_BACKLOG,
                req.body.VC_CHILDWEIGHT,
                req.body.VC_SUPPORTING_DOC
            );

            const start = Date.now();
            let message = await invoke.invokeChaincode(
                "admin",
                channelName,
                chaincodeName,
                fcn,
                args
            );

            let getUser = await query.queryChaincode(
                "admin",
                channelName,
                chaincodeName,
                "getBirthCert",
                [req.body.BIRTH_ID, id]
            );
            console.log(
                "ghfghgfhfgh",
                peers,
                channelName,
                chaincodeName,
                fcn,
                args,
                "admin",
                "Org1"
            );
            console.log("getUser", getUser);
            console.log("message", message);
            const latency = Date.now() - start;
            if (typeof message != "string") {
                let data = {
                    key: id,
                    old_key: req.body.Key,
                    // tx_id: message,
                    Record: {
                        BIRTH_ID: req.body.BIRTH_ID,
                        TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                        I_ULBOBJID: req.body.I_ULBOBJID,
                        VC_SEX: req.body.VC_SEX,
                        VC_SURNAMECHILD: req.body.VC_SURNAMECHILD,
                        VC_NAME_CHILD: req.body.VC_NAME_CHILD,
                        VC_AADHAR_NO: req.body.VC_AADHAR_NO,
                        VC_SURNAME_FATHER: req.body.VC_SURNAME_FATHER,
                        VC_NAME_FATHER: req.body.VC_NAME_FATHER,
                        VC_AADHAR_NO_FATHER: req.body.VC_AADHAR_NO_FATHER,
                        VC_SURNAME_MOTHER: req.body.VC_SURNAME_MOTHER,
                        VC_NAME_MOTHER: req.body.VC_NAME_MOTHER,
                        VC_AADHAR_NO_MOTHER: req.body.VC_AADHAR_NO_MOTHER,
                        VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                        I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                        VC_ADDRESS_LINE_1: req.body.VC_ADDRESS_LINE_1,
                        VC_ADDRESS_LINE_2: req.body.VC_ADDRESS_LINE_2,
                        VC_ADDRESS_LINE_3: req.body.VC_ADDRESS_LINE_3,
                        VC_PIN_CODE: req.body.VC_PIN_CODE,
                        VC_ADDRESS_PARENT: req.body.VC_ADDRESS_PARENT,
                        VC_PERMANENT_ADDRESS_PARENT:
                            req.body.VC_PERMANENT_ADDRESS_PARENT,
                        VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                        VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                        VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                        TS_INFORMED_DATE: req.body.TS_INFORMED_DATE,
                        VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                        VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                        VC_MOBILE_NUMBER: req.body.VC_MOBILE_NUMBER,
                        VC_EMAIL_ID: req.body.VC_EMAIL_ID,
                        VC_RESIDENCE: req.body.VC_RESIDENCE,
                        VC_NAME_TOWN: req.body.VC_NAME_TOWN,
                        VC_NAME_MANDAL: req.body.VC_NAME_MANDAL,
                        VC_NAME_DISTRICT: req.body.VC_NAME_DISTRICT,
                        VC_NAME_STATE: req.body.VC_NAME_STATE,
                        VC_RELIGION: req.body.VC_RELIGION,
                        VC_FATHER_LITERACY: req.body.VC_FATHER_LITERACY,
                        VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                        VC_FATHER_OCCUPATION: req.body.VC_FATHER_OCCUPATION,
                        VC_MOTHER_OCCUPATION: req.body.VC_MOTHER_OCCUPATION,
                        VC_AGE_MOTHER: req.body.VC_AGE_MOTHER,
                        VC_AGE_MOTHER_DELIVERY: req.body.VC_AGE_MOTHER_DELIVERY,
                        VC_NO_CHILD: req.body.VC_NO_CHILD,
                        VC_MEDICAL_ATTENTION: req.body.VC_MEDICAL_ATTENTION,
                        VC_DELIVERY_TYPE: req.body.VC_DELIVERY_TYPE,
                        VC_PREGNANCY_DURATION: req.body.VC_PREGNANCY_DURATION,
                        VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                        VC_NONAVAILABILITY: req.body.VC_NONAVAILABILITY,
                        VC_MAGISTRATE_ORDER: req.body.VC_MAGISTRATE_ORDER,
                        VC_REMARKS: req.body.VC_REMARKS,
                        C_DELFLAG: req.body.C_DELFLAG,
                        TS_DTTM: req.body.TS_DTTM,
                        I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                        TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                        I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                        TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                        VC_CREATED_IP: req.body.VC_CREATED_IP,
                        VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                        I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                        VC_STATUS: req.body.VC_STATUS,
                        VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                        VC_ULB_VERIFIED: req.body.VC_ULB_VERIFIED,
                        VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                        REG_YEAR: req.body.REG_YEAR,
                        TS_REG_DATE: req.body.TS_REG_DATE,
                        TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                        I_LOCALITY: req.body.I_LOCALITY,
                        VC_CERT_NO: req.body.VC_CERT_NO,
                        VC_COURT_CASE_NO: req.body.VC_COURT_CASE_NO,
                        VC_REG_DESIGNATION: req.body.VC_REG_DESIGNATION,
                        VC_REG_REMARKS: req.body.VC_REG_REMARKS,
                        V_REG_SIGN: req.body.V_REG_SIGN,
                        VC_HASHKEY: req.body.VC_HASHKEY,
                        REG_NO: req.body.REG_NO,
                        TS_MC_APPROVED_DT: req.body.TS_MC_APPROVED_DT,
                        ULB_STATUS: req.body.ULB_STATUS,
                        ULB_REMARKS: req.body.ULB_REMARKS,
                        SI_REMARKS: req.body.SI_REMARKS,
                        MC_STATUS: req.body.MC_STATUS,
                        MC_REMARKS: req.body.MC_REMARKS,
                        SI_STATUS: req.body.SI_STATUS,
                        BIRTH_TYPE: req.body.BIRTH_TYPE,
                        VC_STATUS_DT: req.body.VC_STATUS_DT,
                        VC_ULB_STATUS_DT: req.body.VC_ULB_STATUS_DT,
                        VC_SI_STATUS_DT: req.body.VC_SI_STATUS_DT,
                        VC_MC_STATUS_DT: req.body.VC_MC_STATUS_DT,
                        CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                        I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                        I_MANDAL_ID: req.body.I_MANDAL_ID,
                        I_FAT_LITERACY_ID: req.body.I_FAT_LITERACY_ID,
                        I_MOT_LITERACY_ID: req.body.I_MOT_LITERACY_ID,
                        I_FAT_OCC_ID: req.body.I_FAT_OCC_ID,
                        I_MOT_OCC_ID: req.body.I_MOT_OCC_ID,
                        I_RELIGION_ID: req.body.I_RELIGION_ID,
                        I_DELIVERYTYPE_ID: req.body.I_DELIVERYTYPE_ID,
			I_ATTENBIRTH_ID: req.body.I_ATTENBIRTH_ID,
                        FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                        VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                        VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                        VC_NATIONALITY: req.body.VC_NATIONALITY,
                        IS_BACKLOG: req.body.IS_BACKLOG,
                        VC_CHILDWEIGHT: req.body.VC_CHILDWEIGHT,
                        VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                    },
                };

                writeLatencyGauge.inc(latency);
                requestCountGauge.inc();
                successfulTransaction.inc();
                // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Birth certificate  verified",
                    data: data,
                });
            } else {
                let data = {
                    key: id,
                    old_key: req.body.Key,
                    // tx_id: message,
                    Record: {
                        BIRTH_ID: req.body.BIRTH_ID,
                        TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                        I_ULBOBJID: req.body.I_ULBOBJID,
                        VC_SEX: req.body.VC_SEX,
                        VC_SURNAMECHILD: req.body.VC_SURNAMECHILD,
                        VC_NAME_CHILD: req.body.VC_NAME_CHILD,
                        VC_AADHAR_NO: req.body.VC_AADHAR_NO,
                        VC_SURNAME_FATHER: req.body.VC_SURNAME_FATHER,
                        VC_NAME_FATHER: req.body.VC_NAME_FATHER,
                        VC_AADHAR_NO_FATHER: req.body.VC_AADHAR_NO_FATHER,
                        VC_SURNAME_MOTHER: req.body.VC_SURNAME_MOTHER,
                        VC_NAME_MOTHER: req.body.VC_NAME_MOTHER,
                        VC_AADHAR_NO_MOTHER: req.body.VC_AADHAR_NO_MOTHER,
                        VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                        I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                        VC_ADDRESS_LINE_1: req.body.VC_ADDRESS_LINE_1,
                        VC_ADDRESS_LINE_2: req.body.VC_ADDRESS_LINE_2,
                        VC_ADDRESS_LINE_3: req.body.VC_ADDRESS_LINE_3,
                        VC_PIN_CODE: req.body.VC_PIN_CODE,
                        VC_ADDRESS_PARENT: req.body.VC_ADDRESS_PARENT,
                        VC_PERMANENT_ADDRESS_PARENT:
                            req.body.VC_PERMANENT_ADDRESS_PARENT,
                        VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                        VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                        VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                        TS_INFORMED_DATE: req.body.TS_INFORMED_DATE,
                        VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                        VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                        VC_MOBILE_NUMBER: req.body.VC_MOBILE_NUMBER,
                        VC_EMAIL_ID: req.body.VC_EMAIL_ID,
                        VC_RESIDENCE: req.body.VC_RESIDENCE,
                        VC_NAME_TOWN: req.body.VC_NAME_TOWN,
                        VC_NAME_MANDAL: req.body.VC_NAME_MANDAL,
                        VC_NAME_DISTRICT: req.body.VC_NAME_DISTRICT,
                        VC_NAME_STATE: req.body.VC_NAME_STATE,
                        VC_RELIGION: req.body.VC_RELIGION,
                        VC_FATHER_LITERACY: req.body.VC_FATHER_LITERACY,
                        VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                        VC_FATHER_OCCUPATION: req.body.VC_FATHER_OCCUPATION,
                        VC_MOTHER_OCCUPATION: req.body.VC_MOTHER_OCCUPATION,
                        VC_AGE_MOTHER: req.body.VC_AGE_MOTHER,
                        VC_AGE_MOTHER_DELIVERY: req.body.VC_AGE_MOTHER_DELIVERY,
                        VC_NO_CHILD: req.body.VC_NO_CHILD,
                        VC_MEDICAL_ATTENTION: req.body.VC_MEDICAL_ATTENTION,
                        VC_DELIVERY_TYPE: req.body.VC_DELIVERY_TYPE,
                        VC_PREGNANCY_DURATION: req.body.VC_PREGNANCY_DURATION,
                        VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                        VC_NONAVAILABILITY: req.body.VC_NONAVAILABILITY,
                        VC_MAGISTRATE_ORDER: req.body.VC_MAGISTRATE_ORDER,
                        VC_REMARKS: req.body.VC_REMARKS,
                        C_DELFLAG: req.body.C_DELFLAG,
                        TS_DTTM: req.body.TS_DTTM,
                        I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                        TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                        I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                        TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                        VC_CREATED_IP: req.body.VC_CREATED_IP,
                        VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                        I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                        VC_STATUS: req.body.VC_STATUS,
                        VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                        VC_ULB_VERIFIED: req.body.VC_ULB_VERIFIED,
                        VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                        REG_YEAR: req.body.REG_YEAR,
                        TS_REG_DATE: req.body.TS_REG_DATE,
                        TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                        I_LOCALITY: req.body.I_LOCALITY,
                        VC_CERT_NO: req.body.VC_CERT_NO,
                        VC_COURT_CASE_NO: req.body.VC_COURT_CASE_NO,
                        VC_REG_DESIGNATION: req.body.VC_REG_DESIGNATION,
                        VC_REG_REMARKS: req.body.VC_REG_REMARKS,
                        V_REG_SIGN: req.body.V_REG_SIGN,
                        VC_HASHKEY: req.body.VC_HASHKEY,
                        REG_NO: req.body.REG_NO,
                        TS_MC_APPROVED_DT: req.body.TS_MC_APPROVED_DT,
                        ULB_STATUS: req.body.ULB_STATUS,
                        ULB_REMARKS: req.body.ULB_REMARKS,
                        SI_REMARKS: req.body.SI_REMARKS,
                        MC_STATUS: req.body.MC_STATUS,
                        MC_REMARKS: req.body.MC_REMARKS,
                        SI_STATUS: req.body.SI_STATUS,
                        BIRTH_TYPE: req.body.BIRTH_TYPE,
                        VC_STATUS_DT: req.body.VC_STATUS_DT,
                        VC_ULB_STATUS_DT: req.body.VC_ULB_STATUS_DT,
                        VC_SI_STATUS_DT: req.body.VC_SI_STATUS_DT,
                        VC_MC_STATUS_DT: req.body.VC_MC_STATUS_DT,
                        CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                        I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                        I_MANDAL_ID: req.body.I_MANDAL_ID,
                        I_FAT_LITERACY_ID: req.body.I_FAT_LITERACY_ID,
                        I_MOT_LITERACY_ID: req.body.I_MOT_LITERACY_ID,
                        I_FAT_OCC_ID: req.body.I_FAT_OCC_ID,
                        I_MOT_OCC_ID: req.body.I_MOT_OCC_ID,
                        I_RELIGION_ID: req.body.I_RELIGION_ID,
                        I_DELIVERYTYPE_ID: req.body.I_DELIVERYTYPE_ID,
			I_ATTENBIRTH_ID: req.body.I_ATTENBIRTH_ID,
                        FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                        VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                        VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                        VC_NATIONALITY: req.body.VC_NATIONALITY,
                        IS_BACKLOG: req.body.IS_BACKLOG,
                        VC_CHILDWEIGHT: req.body.VC_CHILDWEIGHT,
                        VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                    },
                };
                _BirthCertModel.create({
                    Key: id,
                    TransactionID: message,
                    BIRTH_ID: req.body.BIRTH_ID,
                    TS_DATE_OF_BIRTH: req.body.TS_DATE_OF_BIRTH,
                    I_ULBOBJID: req.body.I_ULBOBJID,
                    VC_SEX: req.body.VC_SEX,
                    VC_SURNAMECHILD: req.body.VC_SURNAMECHILD,
                    VC_NAME_CHILD: req.body.VC_NAME_CHILD,
                    VC_AADHAR_NO: req.body.VC_AADHAR_NO,
                    VC_SURNAME_FATHER: req.body.VC_SURNAME_FATHER,
                    VC_NAME_FATHER: req.body.VC_NAME_FATHER,
                    VC_AADHAR_NO_FATHER: req.body.VC_AADHAR_NO_FATHER,
                    VC_SURNAME_MOTHER: req.body.VC_SURNAME_MOTHER,
                    VC_NAME_MOTHER: req.body.VC_NAME_MOTHER,
                    VC_AADHAR_NO_MOTHER: req.body.VC_AADHAR_NO_MOTHER,
                    VC_PLACE_OF_BIRTH: req.body.VC_PLACE_OF_BIRTH,
                    I_HOSPITAL_ID: req.body.I_HOSPITAL_ID,
                    VC_ADDRESS_LINE_1: req.body.VC_ADDRESS_LINE_1,
                    VC_ADDRESS_LINE_2: req.body.VC_ADDRESS_LINE_2,
                    VC_ADDRESS_LINE_3: req.body.VC_ADDRESS_LINE_3,
                    VC_PIN_CODE: req.body.VC_PIN_CODE,
                    VC_ADDRESS_PARENT: req.body.VC_ADDRESS_PARENT,
                    VC_PERMANENT_ADDRESS_PARENT:
                        req.body.VC_PERMANENT_ADDRESS_PARENT,
                    VC_INFORMANT_SURNAME: req.body.VC_INFORMANT_SURNAME,
                    VC_INFORMANT_NAME: req.body.VC_INFORMANT_NAME,
                    VC_INFORMANT_ADDRESS: req.body.VC_INFORMANT_ADDRESS,
                    TS_INFORMED_DATE: req.body.TS_INFORMED_DATE,
                    VC_INFORMANT_SIGN: req.body.VC_INFORMANT_SIGN,
                    VC_INFORMANT_REMARKS: req.body.VC_INFORMANT_REMARKS,
                    VC_MOBILE_NUMBER: req.body.VC_MOBILE_NUMBER,
                    VC_EMAIL_ID: req.body.VC_EMAIL_ID,
                    VC_RESIDENCE: req.body.VC_RESIDENCE,
                    VC_NAME_TOWN: req.body.VC_NAME_TOWN,
                    VC_NAME_MANDAL: req.body.VC_NAME_MANDAL,
                    VC_NAME_DISTRICT: req.body.VC_NAME_DISTRICT,
                    VC_NAME_STATE: req.body.VC_NAME_STATE,
                    VC_RELIGION: req.body.VC_RELIGION,
                    VC_FATHER_LITERACY: req.body.VC_FATHER_LITERACY,
                    VC_MOTHER_LITERACY: req.body.VC_MOTHER_LITERACY,
                    VC_FATHER_OCCUPATION: req.body.VC_FATHER_OCCUPATION,
                    VC_MOTHER_OCCUPATION: req.body.VC_MOTHER_OCCUPATION,
                    VC_AGE_MOTHER: req.body.VC_AGE_MOTHER,
                    VC_AGE_MOTHER_DELIVERY: req.body.VC_AGE_MOTHER_DELIVERY,
                    VC_NO_CHILD: req.body.VC_NO_CHILD,
                    VC_MEDICAL_ATTENTION: req.body.VC_MEDICAL_ATTENTION,
                    VC_DELIVERY_TYPE: req.body.VC_DELIVERY_TYPE,
                    VC_PREGNANCY_DURATION: req.body.VC_PREGNANCY_DURATION,
                    VC_AFFIDAVIT: req.body.VC_AFFIDAVIT,
                    VC_NONAVAILABILITY: req.body.VC_NONAVAILABILITY,
                    VC_MAGISTRATE_ORDER: req.body.VC_MAGISTRATE_ORDER,
                    VC_REMARKS: req.body.VC_REMARKS,
                    C_DELFLAG: req.body.C_DELFLAG,
                    TS_DTTM: req.body.TS_DTTM,
                    I_CERATED_BY_ID: req.body.I_CERATED_BY_ID,
                    TS_CREATED_TIME: req.body.TS_CREATED_TIME,
                    I_MODIFIED_BY_ID: req.body.I_MODIFIED_BY_ID,
                    TS_MODIFIED_TIME: req.body.TS_MODIFIED_TIME,
                    VC_CREATED_IP: req.body.VC_CREATED_IP,
                    VC_MODIFIED_IP: req.body.VC_MODIFIED_IP,
                    I_APP_RECEIVED_ID: req.body.I_APP_RECEIVED_ID,
                    VC_STATUS: req.body.VC_STATUS,
                    VC_MC_REMARKS: req.body.VC_MC_REMARKS,
                    VC_ULB_VERIFIED: req.body.VC_ULB_VERIFIED,
                    VC_CSC_REMARKS: req.body.VC_CSC_REMARKS,
                    REG_YEAR: req.body.REG_YEAR,
                    TS_REG_DATE: req.body.TS_REG_DATE,
                    TS_MC_APPROVED_DATE: req.body.TS_MC_APPROVED_DATE,
                    I_LOCALITY: req.body.I_LOCALITY,
                    VC_CERT_NO: req.body.VC_CERT_NO,
                    VC_COURT_CASE_NO: req.body.VC_COURT_CASE_NO,
                    VC_REG_DESIGNATION: req.body.VC_REG_DESIGNATION,
                    VC_REG_REMARKS: req.body.VC_REG_REMARKS,
                    V_REG_SIGN: req.body.V_REG_SIGN,
                    VC_HASHKEY: req.body.VC_HASHKEY,
                    REG_NO: req.body.REG_NO,
                    TS_MC_APPROVED_DT: req.body.TS_MC_APPROVED_DT,
                    ULB_STATUS: req.body.ULB_STATUS,
                    ULB_REMARKS: req.body.ULB_REMARKS,
                    SI_REMARKS: req.body.SI_REMARKS,
                    MC_STATUS: req.body.MC_STATUS,
                    MC_REMARKS: req.body.MC_REMARKS,
                    SI_STATUS: req.body.SI_STATUS,
                    BIRTH_TYPE: req.body.BIRTH_TYPE,
                    VC_STATUS_DT: req.body.VC_STATUS_DT,
                    VC_ULB_STATUS_DT: req.body.VC_ULB_STATUS_DT,
                    VC_SI_STATUS_DT: req.body.VC_SI_STATUS_DT,
                    VC_MC_STATUS_DT: req.body.VC_MC_STATUS_DT,
                    CITIZEN_ENT_ID: req.body.CITIZEN_ENT_ID,
                    I_DISTRICT_ID: req.body.I_DISTRICT_ID,
                    I_MANDAL_ID: req.body.I_MANDAL_ID,
                    I_FAT_LITERACY_ID: req.body.I_FAT_LITERACY_ID,
                    I_MOT_LITERACY_ID: req.body.I_MOT_LITERACY_ID,
                    I_FAT_OCC_ID: req.body.I_FAT_OCC_ID,
                    I_MOT_OCC_ID: req.body.I_MOT_OCC_ID,
                    I_RELIGION_ID: req.body.I_RELIGION_ID,
                    I_DELIVERYTYPE_ID: req.body.I_DELIVERYTYPE_ID,
		    I_ATTENBIRTH_ID: req.body.I_ATTENBIRTH_ID,
                    FORM_UPLOAD1: req.body.FORM_UPLOAD1,
                    VC_COUNTRY_NAME: req.body.VC_COUNTRY_NAME,
                    VC_COUNTRY_ADDRESS: req.body.VC_COUNTRY_ADDRESS,
                    VC_NATIONALITY: req.body.VC_NATIONALITY,
                    IS_BACKLOG: req.body.IS_BACKLOG,
                    VC_CHILDWEIGHT: req.body.VC_CHILDWEIGHT,
                    VC_SUPPORTING_DOC: req.body.VC_SUPPORTING_DOC,
                });

                writeLatencyGauge.inc(latency);
                requestCountGauge.inc();
                successfulTransaction.inc();
                // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

                return res.status(200).json({
                    status: 200,
                    success: true,
                    message:
                        "Birth certificate verified and updated successfully!",
                    data: data,
                });
            }
        }

        return res.status(400).json({
            status: 400,
            success: false,
            message: "Birth certificate not verified",
            data: "",
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message,
        });
    }
}

async function importData(req, res, next) {
    try {
        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "birthcert";
        var channelName = "mychannel";
        var fcn = "createBirthCert";

        const wb = XLSX.readFile(req.file.path);
        const sheets = wb.SheetNames;

        if (sheets.length > 0) {
            const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

            const birtData = data.map((row) => [
                generateUniqueId({ length: 64 }),
                row["BIRTH_ID"],
                row["TS_DATE_OF_BIRTH"],
                row["I_ULBOBJID"],
                row["VC_SEX"],
                row["VC_SURNAMECHILD"],
                row["VC_NAME_CHILD"],
                row["VC_AADHAR_NO"],
                row["VC_SURNAME_FATHER"],
                row["VC_NAME_FATHER"],
                row["VC_AADHAR_NO_FATHER"],
                row["VC_SURNAME_MOTHER"],
                row["VC_NAME_MOTHER"],
                row["VC_AADHAR_NO_MOTHER"],
                row["VC_PLACE_OF_BIRTH"],
                row["I_HOSPITAL_ID"],
                row["VC_ADDRESS_LINE_1"],
                row["VC_ADDRESS_LINE_2"],
                row["VC_ADDRESS_LINE_3"],
                row["VC_PIN_CODE"],
                row["VC_ADDRESS_PARENT"],
                row["VC_PERMANENT_ADDRESS_PARENT"],
                row["VC_INFORMANT_SURNAME"],
                row["VC_INFORMANT_NAME"],
                row["VC_INFORMANT_ADDRESS"],
                row["TS_INFORMED_DATE"],
                row["VC_INFORMANT_SIGN"],
                row["VC_INFORMANT_REMARKS"],
                row["VC_MOBILE_NUMBER"],
                row["VC_EMAIL_ID"],
                row["VC_RESIDENCE"],
                row["VC_NAME_TOWN"],
                row["VC_NAME_MANDAL"],
                row["VC_NAME_DISTRICT"],
                row["VC_NAME_STATE"],
                row["VC_RELIGION"],
                row["VC_FATHER_LITERACY"],
                row["VC_MOTHER_LITERACY"],
                row["VC_FATHER_OCCUPATION"],
                row["VC_MOTHER_OCCUPATION"],
                row["VC_AGE_MOTHER"],
                row["VC_AGE_MOTHER_DELIVERY"],
                row["VC_NO_CHILD"],
                row["VC_MEDICAL_ATTENTION"],
                row["VC_DELIVERY_TYPE"],
                row["VC_PREGNANCY_DURATION"],
                row["VC_AFFIDAVIT"],
                row["VC_NONAVAILABILITY"],
                row["VC_MAGISTRATE_ORDER"],
                row["VC_REMARKS"],
                row["C_DELFLAG"],
                row["TS_DTTM"],
                row["I_CERATED_BY_ID"],
                row["TS_CREATED_TIME"],
                row["I_MODIFIED_BY_ID"],
                row["TS_MODIFIED_TIME"],
                row["VC_CREATED_IP"],
                row["VC_MODIFIED_IP"],
                row["I_APP_RECEIVED_ID"],
                row["VC_STATUS"],
                row["VC_MC_REMARKS"],
                row["VC_ULB_VERIFIED"],
                row["VC_CSC_REMARKS"],
                row["REG_YEAR"],
                row["TS_REG_DATE"],
                row["TS_MC_APPROVED_DATE"],
                row["I_LOCALITY"],
                row["VC_CERT_NO"],
                row["VC_COURT_CASE_NO"],
                row["VC_REG_DESIGNATION"],
                row["VC_REG_REMARKS"],
                row["V_REG_SIGN"],
                row["VC_HASHKEY"],
                row["REG_NO"],
                row["TS_MC_APPROVED_DT"],
                row["ULB_STATUS"],
                row["ULB_REMARKS"],
                row["SI_REMARKS"],
                row["MC_STATUS"],
                row["MC_REMARKS"],
                row["SI_STATUS"],
                row["BIRTH_TYPE"],
                row["VC_STATUS_DT"],
                row["VC_ULB_STATUS_DT"],
                row["VC_SI_STATUS_DT"],
                row["VC_MC_STATUS_DT"],
                row["CITIZEN_ENT_ID"],
                row["I_DISTRICT_ID"],
                row["I_MANDAL_ID"],
                row["I_FAT_LITERACY_ID"],
                row["I_MOT_LITERACY_ID"],
                row["I_FAT_OCC_ID"],
                row["I_MOT_OCC_ID"],
                row["I_RELIGION_ID"],
                row["I_DELIVERYTYPE_ID"],
		row["I_ATTENBIRTH_ID"],
                row["FORM_UPLOAD1"],
                row["VC_COUNTRY_NAME"],
                row["VC_COUNTRY_ADDRESS"],
                row["VC_NATIONALITY"],
                row["IS_BACKLOG"],
                row["VC_CHILDWEIGHT"],
                row["VC_SUPPORTING_DOC"],
            ]);
            const start = Date.now();
            const latency = Date.now() - start;
            const _importData = [];

            birtData.forEach(async (args, i) => {
                setTimeout(async () => {
                    await invoke.invokeChaincode(
                        "admin",
                        channelName,
                        chaincodeName,
                        fcn,
                        args
                    );
                }, i * 1000);

                _importData.push({
                    key: args[0],
                    Record: {
                        BIRTH_ID: args[1],
                        TS_DATE_OF_BIRTH: args[2],
                        I_ULBOBJID: args[3],
                        VC_SEX: args[4],
                        VC_SURNAMECHILD: args[5],
                        VC_NAME_CHILD: args[6],
                        VC_AADHAR_NO: args[7],
                        VC_SURNAME_FATHER: args[8],
                        VC_NAME_FATHER: args[9],
                        VC_AADHAR_NO_FATHER: args[10],
                        VC_SURNAME_MOTHER: args[11],
                        VC_NAME_MOTHER: args[12],
                        VC_AADHAR_NO_MOTHER: args[13],
                        VC_PLACE_OF_BIRTH: args[14],
                        I_HOSPITAL_ID: args[15],
                        VC_ADDRESS_LINE_1: args[16],
                        VC_ADDRESS_LINE_2: args[17],
                        VC_ADDRESS_LINE_3: args[18],
                        VC_PIN_CODE: args[19],
                        VC_ADDRESS_PARENT: args[20],
                        VC_PERMANENT_ADDRESS_PARENT: args[21],
                        VC_INFORMANT_SURNAME: args[22],
                        VC_INFORMANT_NAME: args[23],
                        VC_INFORMANT_ADDRESS: args[24],
                        TS_INFORMED_DATE: args[25],
                        VC_INFORMANT_SIGN: args[26],
                        VC_INFORMANT_REMARKS: args[27],
                        VC_MOBILE_NUMBER: args[28],
                        VC_EMAIL_ID: args[29],
                        VC_RESIDENCE: args[30],
                        VC_NAME_TOWN: args[31],
                        VC_NAME_MANDAL: args[32],
                        VC_NAME_DISTRICT: args[33],
                        VC_NAME_STATE: args[34],
                        VC_RELIGION: args[35],
                        VC_FATHER_LITERACY: args[36],
                        VC_MOTHER_LITERACY: args[37],
                        VC_FATHER_OCCUPATION: args[38],
                        VC_MOTHER_OCCUPATION: args[39],
                        VC_AGE_MOTHER: args[40],
                        VC_AGE_MOTHER_DELIVERY: args[41],
                        VC_NO_CHILD: args[42],
                        VC_MEDICAL_ATTENTION: args[43],
                        VC_DELIVERY_TYPE: args[44],
                        VC_PREGNANCY_DURATION: args[45],
                        VC_AFFIDAVIT: args[46],
                        VC_NONAVAILABILITY: args[47],
                        VC_MAGISTRATE_ORDER: args[48],
                        VC_REMARKS: args[49],
                        C_DELFLAG: args[50],
                        TS_DTTM: args[51],
                        I_CERATED_BY_ID: args[52],
                        TS_CREATED_TIME: args[53],
                        I_MODIFIED_BY_ID: args[54],
                        TS_MODIFIED_TIME: args[55],
                        VC_CREATED_IP: args[56],
                        VC_MODIFIED_IP: args[57],
                        I_APP_RECEIVED_ID: args[58],
                        VC_STATUS: args[59],
                        VC_MC_REMARKS: args[60],
                        VC_ULB_VERIFIED: args[61],
                        VC_CSC_REMARKS: args[62],
                        REG_YEAR: args[63],
                        TS_REG_DATE: args[64],
                        TS_MC_APPROVED_DATE: args[65],
                        I_LOCALITY: args[66],
                        VC_CERT_NO: args[67],
                        VC_COURT_CASE_NO: args[68],
                        VC_REG_DESIGNATION: args[69],
                        VC_REG_REMARKS: args[70],
                        V_REG_SIGN: args[71],
                        VC_HASHKEY: args[72],
                        REG_NO: args[73],
                        TS_MC_APPROVED_DT: args[74],
                        ULB_STATUS: args[75],
                        ULB_REMARKS: args[76],
                        SI_REMARKS: args[77],
                        MC_STATUS: args[78],
                        MC_REMARKS: args[79],
                        SI_STATUS: args[80],
                        BIRTH_TYPE: args[81],
                        VC_STATUS_DT: args[82],
                        VC_ULB_STATUS_DT: args[83],
                        VC_SI_STATUS_DT: args[84],
                        VC_MC_STATUS_DT: args[85],
                        CITIZEN_ENT_ID: args[86],
                        I_DISTRICT_ID: args[87],
                        I_MANDAL_ID: args[88],
                        I_FAT_LITERACY_ID: args[89],
                        I_MOT_LITERACY_ID: args[90],
                        I_FAT_OCC_ID: args[91],
                        I_MOT_OCC_ID: args[92],
                        I_RELIGION_ID: args[93],
                        I_DELIVERYTYPE_ID: args[94],
                        I_ATTENBIRTH_ID: args[95],
                        FORM_UPLOAD1: args[96],
                        VC_COUNTRY_NAME: args[97],
                        VC_COUNTRY_ADDRESS: args[98],
                        VC_NATIONALITY: args[99],
                        IS_BACKLOG: args[100],
                        VC_CHILDWEIGHT: args[101],
                        VC_SUPPORTING_DOC: args[102],
                    },
                });
            });

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Birthday certificate validated successfully!",
                data: _importData,
            });
        }

        return res.status(200).json({
            status: 400,
            success: false,
            message: "Somthing went wrong!",
            data: "",
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message,
        });
    }
}

async function index(req, res, next) {
    try {
        var channelName = "mychannel";
        var chaincodeName = "birthcert";
        let args = req.query.args;
        let fcn = "allList";

        if (!args) {
            res.json(getErrorMessage("'args'"));
            return;
        }
        console.log("args==========", args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        const start = Date.now();
        let message = await query.queryChaincode(
            "admin",
            channelName,
            chaincodeName,
            fcn,
            args
        );
        // message = message.replace(/'/g, '"');
        const latency = Date.now() - start;
        readLatencyGauge.inc(latency);
        queriesCountGauge.inc();
        data = JSON.parse(message);
        return res.status(200).json({
            status: 200,
            success: true,
            message: "All Birth certificate found successfully",
            data: data,
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message,
        });
    }
}

async function show(req, res, next) {
    try {
        var channelName = "mychannel";
        var chaincodeName = "birthcert";
        let args = req.query.args;
        let fcn = "getBirthCert";

        if (!args) {
            res.json(getErrorMessage("'args'"));
            return;
        }
        console.log("args==========", args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        const start = Date.now();
        let message = await query.queryChaincode(
            "admin",
            channelName,
            chaincodeName,
            fcn,
            args
        );
        // message = message.replace(/'/g, '"');
        const latency = Date.now() - start;
        readLatencyGauge.inc(latency);
        queriesCountGauge.inc();
        logger.debug("Data............", message);
        if (typeof message != "object") {
            data = JSON.parse(message);
            data = {
                key: args[1],
                Record: data,
            };

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Validated successfully!",
                data: data,
            });
        } else {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Not valid!",
                data: "",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message,
        });
    }
}

exports.store = store;
exports.update = update;
exports.index = index;
exports.show = show;
exports.importData = importData;
