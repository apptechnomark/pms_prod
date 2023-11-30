/* eslint-disable react/display-name */
import {
  Button,
  CheckBox,
  MultiSelectChip,
  Select,
  Tel,
  Text,
  Email,
  Toast,
  Textarea,
  Loader,
  Radio,
  Datepicker,
} from "next-ts-lib";
import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import dayjs from "dayjs";

export interface ClientContentRef {
  clearAllData: () => void;
}

const ClientContent = forwardRef<
  ClientContentRef,
  {
    tab: string;
    onEdit: boolean;
    onClose: () => void;
    clientData: any;
    onDataFetch: any;
    onOpen: boolean;
  }
>(({ tab, onEdit, onClose, clientData, onOpen, onDataFetch }, ref) => {
  const [workType, setWorkType] = useState<any>([]);
  const [billingTypeData, setBillingTypeData] = useState([]);
  const [layoutTypeData, setLayoutTypeData] = useState([]);
  const [groupTypeData, setGroupTypeData] = useState([]);
  const [hasTax, setHasTax] = useState(false);

  const [Id, setId] = useState(0);
  const [accountingId, setAccountingId] = useState(0);
  const [auditId, setAuditId] = useState(0);
  const [taxId, setTaxId] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientError, setClientError] = useState(false);
  const [clientNameHasError, setClientNameHasError] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressHasError, setAddressHasError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailHasError, setEmailHasError] = useState(false);
  const [tel, setTel] = useState("");
  const [telError, settelError] = useState(false);

  const [accounting, setAccounting] = useState(false);
  const [audit, setAudit] = useState(false);
  const [tax, setTax] = useState(false);
  const [isAccountingOpen, setIsAccountingOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isTaxOpen, setIsTaxOpen] = useState(false);

  // Getting WorkType's Data
  const [workTypeData, setWorkTypeData] = useState<any>([]);
  const [workTypeAccData, setWorkTypeAccData] = useState<any>([]);
  const [workTypeAuditData, setWorkTypeAuditData] = useState<any>([]);
  const [workTypeTaxData, setWorkTypeTaxData] = useState<any>([]);
  const [loader, setLoader] = useState(false);

  const [accBillingType, setAccBillingType] = useState(0);
  const [accBillingErr, setAccBillingErr] = useState(false);
  const [accBillingHasErr, setAccBillingHasErr] = useState(true);
  const [accGroup, setAccGroup] = useState([]);
  const [accGroupErr, setAccGroupErr] = useState(false);
  const [accGroupHasErr, setAccGroupHasErr] = useState(true);
  const [accLayout, setAccLayout] = useState(0);
  const [accLayoutErr, setAccLayoutErr] = useState(false);
  const [accLayoutHasErr, setAccLayoutHasErr] = useState(true);
  const [accContHrs, setAccContHrs] = useState<any>(0);
  const [accContHrsErr, setAccContHrsErr] = useState(false);
  const [accContHrsHasErr, setAccContHrsHasErr] = useState(true);
  const [accContHrsErrMsg, setAccContHrsErrMsg] = useState("");
  const [accActualHrs, setAccActHrs] = useState<any>(0);
  const [accActualHrsErr, setAccActHrsErr] = useState(false);
  const [accActualHrsHasErr, setAccActHrsHasErr] = useState(true);
  const [accActualHrsErrMsg, setAccActualHrsErrMsg] = useState("");
  const [accHasError, setAccHasError] = useState(false);

  const [auditBillingType, setAuditBillingType] = useState(0);
  const [auditBillingErr, setAuditBillingErr] = useState(false);
  const [auditBillingHasErr, setAuditBillingHasErr] = useState(true);
  const [auditGroup, setAuditGroup] = useState([]);
  const [auditGroupErr, setAuditGroupErr] = useState(false);
  const [auditGroupHasErr, setAuditGroupHasErr] = useState(true);
  const [auditLayout, setAuditLayout] = useState(0);
  const [auditLayoutErr, setAuditLayoutErr] = useState(false);
  const [auditLayoutHasErr, setAuditLayoutHasErr] = useState(true);
  const [auditContHrs, setAuditContHrs] = useState<any>(0);
  const [auditContHrsErr, setAuditContHrsErr] = useState(false);
  const [auditContHrsHasErr, setAuditContHrsHasErr] = useState(true);
  const [auditContHrsErrMsg, setAuditContHrsErrMsg] = useState("");
  const [auditActualHrs, setAuditActHrs] = useState<any>(0);
  const [auditActualHrsErr, setAuditActHrsErr] = useState(false);
  const [auditActualHrsErrMsg, setAuditActualHrsErrMsg] = useState("");
  const [auditActualHrsHasErr, setAuditActHrsHasErr] = useState(true);
  const [auditHasError, setAuditHasError] = useState(false);

  const [taxBillingType, setTaxBillingType] = useState(0);
  const [taxBillingErr, setTaxBillingErr] = useState(false);
  const [taxBillingHasErr, setTaxBillingHasErr] = useState(true);
  const [taxGroup, setTaxGroup] = useState([]);
  const [taxGroupErr, setTaxGroupErr] = useState(false);
  const [taxGroupHasErr, setTaxGroupHasErr] = useState(true);
  const [taxLayout, setTaxLayout] = useState(0);
  const [taxLayoutErr, setTaxLayoutErr] = useState(false);
  const [taxLayoutHasErr, setTaxLayoutHasErr] = useState(true);
  const [taxContHrs, setTaxContHrs] = useState<any>(0);
  const [taxContHrsErr, setTaxContHrsErr] = useState(false);
  const [taxContHrsHasErr, setTaxContHrsHasErr] = useState(true);
  const [taxContHrsErrMsg, setTaxContHrsErrMsg] = useState("");
  const [taxActualHrs, setTaxActHrs] = useState<any>(0);
  const [taxActualHrsErr, setTaxActHrsErr] = useState(false);
  const [taxActualHrsErrMsg, setTaxActualHrsErrMsg] = useState("");
  const [taxActualHrsHasErr, setTaxActHrsHasErr] = useState(true);
  const [taxHasError, setTaxHasError] = useState(false);

  // Additional Field's State
  const [addMoreClicked, setAddMoreClicked] = useState(false);
  const [isAddClientClicked, setIsAddClientClicked] = useState(true);
  const [isAdditionalFieldsClicked, setIsAdditionalFieldsClicked] =
    useState(false);
  const [deletedPocFields, setDeletedPocFields] = useState<any>([]);
  const [pocFields, setPocFields] = useState<any>([
    {
      Name: null,
      Email: null,
    },
  ]);
  const [stateList, setStateList] = useState<string[] | any>([]);
  const [cpaName, setCpaName] = useState<string>("");
  const [cpaEmail, setCpaEmail] = useState<string>("");
  const [cpaMobileNo, setCpaMobileNo] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<number>(0);
  const [zip, setZip] = useState<string>("");
  const [clientItPOCName, setClientItPOCName] = useState<string>("");
  const [clientItPOCEmail, setClientItPOCEmail] = useState<string>("");
  const [pabsPOCName, setPabsPOCName] = useState<string>("");
  const [pabsBDM, setPabsBDM] = useState<string>("");
  const [pabsManagerAssigned, setPabsManagerAssigned] = useState<string>("");
  const [groupEmail, setGroupEmail] = useState<string>("");
  const [sopStatus, setSOPStatus] = useState<string>("");
  const [dateOfImplementation, setDateofImplementation] = useState<any>("");
  const [agreementStartDate, setAgreementStartDate] = useState<any>("");
  const [fteAgreement, setFteAgreement] = useState<string>("");
  const [estimationWorkflow, setEstimationWorkFlow] = useState<string>("");
  const [vpnRequirement, setVpnRequirement] = useState<string>("");
  const [remoteSystemAccess, setRemoteSystemAccess] = useState<string>("");
  const [taxPreparationSoftware, setTaxPreparationSoftware] =
    useState<string>("");
  const [documentPortal, setDocumentPortal] = useState<string>("");
  const [workflowTracker, setWorkflowTracker] = useState<string>("");
  const [communicationChannel, setCommunicationChannel] = useState<string>("");
  const [recurringCall, setRecurringCall] = useState<string>("");
  const [specificProcessStep, setSpecificProcessStep] = useState<string>("");
  const [clientTimeZone, setClientTimeZone] = useState<string>("");

  const addTaskField = () => {
    setPocFields([
      ...pocFields,
      {
        Name: null,
        Email: null,
      },
    ]);
  };

  const removePocField = (index: number) => {
    setDeletedPocFields([...deletedPocFields, pocFields[index]]);

    const newTaskFields = [...pocFields];
    newTaskFields.splice(index, 1);
    setPocFields(newTaskFields);
  };

  const handleClientPOCNameChange = (e: any, index: number) => {
    const newPOCFields = [...pocFields];
    newPOCFields[index].Name = e;
    setPocFields(newPOCFields);
  };

  const handleClientPOCEmailChange = (e: any, index: number) => {
    const newPOCFields = [...pocFields];
    newPOCFields[index].Email = e;
    setPocFields(newPOCFields);
  };

  const toggleAccountingAccordion = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsAccountingOpen((prevIsOpen) => !prevIsOpen);
    setAccounting(e.target.checked);
    e.target.checked
      ? (setAccBillingHasErr(false),
        setAccGroupHasErr(false),
        setAccContHrsHasErr(false),
        setAccActHrsHasErr(false))
      : (setAccBillingHasErr(true),
        setAccGroupHasErr(true),
        setAccContHrsHasErr(true),
        setAccActHrsHasErr(true));
    // setIsAuditOpen(false);
    // setIsTaxationOpen(false);
  };

  const toggleAuditAccordion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAuditOpen((prevIsOpen) => !prevIsOpen);
    setAudit(e.target.checked);
    e.target.checked
      ? (setAuditBillingHasErr(false),
        setAuditGroupHasErr(false),
        setAuditContHrsHasErr(false),
        setAuditActHrsHasErr(false))
      : (setAuditBillingHasErr(true),
        setAuditGroupHasErr(true),
        setAuditContHrsHasErr(true),
        setAuditActHrsHasErr(true));
    // setIsAccountingOpen(false);
    // setIsTaxationOpen(false);
  };

  const toggleTaxAccordion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTaxOpen((prevIsOpen) => !prevIsOpen);
    setTax(e.target.checked);
    e.target.checked
      ? (setTaxBillingHasErr(false),
        setTaxGroupHasErr(false),
        setTaxContHrsHasErr(false),
        setTaxActHrsHasErr(false))
      : (setTaxBillingHasErr(true),
        setTaxGroupHasErr(true),
        setTaxContHrsHasErr(true),
        setTaxActHrsHasErr(true));
    // setIsAccountingOpen(false);
    // setIsAuditOpen(false);
  };

  useEffect(() => {
    if (clientData && onEdit) {
      const getClientById = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.pms_api_url}/client/GetById`,
            {
              clientId: onEdit || 0,
            },
            {
              headers: {
                Authorization: `bearer ${token}`,
                org_token: `${Org_Token}`,
              },
            }
          );

          if (response.status === 200) {
            if (response.data.ResponseStatus === "Success") {
              setClientName(response.data.ResponseData.Name);
              setClientNameHasError(true);
              setAddress(response.data.ResponseData.Address);
              setAddressHasError(true);
              setEmail(response.data.ResponseData.Email);
              setEmailHasError(true);
              setTel(response.data.ResponseData.ContactNo);
              setId(response.data.ResponseData.Id);
              setWorkTypeData(response.data.ResponseData.WorkTypes);

              setCpaName(
                response.data.ResponseData.OwnerAndCPAName === null
                  ? ""
                  : response.data.ResponseData.OwnerAndCPAName
              );
              setCpaEmail(
                response.data.ResponseData.OwnerEmail === null
                  ? ""
                  : response.data.ResponseData.OwnerEmail
              );
              setCpaMobileNo(
                response.data.ResponseData.OwnerPhone === null
                  ? ""
                  : response.data.ResponseData.OwnerPhone
              );
              setCity(
                response.data.ResponseData.City === null
                  ? ""
                  : response.data.ResponseData.City
              );
              setState(
                response.data.ResponseData.StateId === null
                  ? 0
                  : response.data.ResponseData.StateId
              );
              setZip(
                response.data.ResponseData.Zip === null
                  ? ""
                  : response.data.ResponseData.Zip
              );

              setPocFields(
                response.data.ResponseData.ClientPOCInformation.length === 0
                  ? pocFields
                  : response.data.ResponseData.ClientPOCInformation
              );

              setClientItPOCName(
                response.data.ResponseData.ClientITPOCName === null
                  ? ""
                  : response.data.ResponseData.ClientITPOCName
              );
              setClientItPOCEmail(
                response.data.ResponseData.ClientITPOCEmail === null
                  ? ""
                  : response.data.ResponseData.ClientITPOCEmail
              );
              setPabsPOCName(
                response.data.ResponseData.PABSPOCName === null
                  ? ""
                  : response.data.ResponseData.PABSPOCName
              );
              setPabsBDM(
                response.data.ResponseData.PABSBDM === null
                  ? ""
                  : response.data.ResponseData.PABSBDM
              );
              setPabsManagerAssigned(
                response.data.ResponseData.PABSManagerAssigned === null
                  ? ""
                  : response.data.ResponseData.PABSManagerAssigned
              );
              setGroupEmail(
                response.data.ResponseData.GroupMail === null
                  ? ""
                  : response.data.ResponseData.GroupMail
              );
              setSOPStatus(
                response.data.ResponseData.SOPStatus === null
                  ? ""
                  : response.data.ResponseData.SOPStatus
              );
              setDateofImplementation(
                response.data.ResponseData.DateOfImplementation === null
                  ? ""
                  : dayjs(
                      response.data.ResponseData.DateOfImplementation
                    ).format("MM/DD/YYYY")
              );
              setAgreementStartDate(
                response.data.ResponseData.AgreementStartDate === null
                  ? ""
                  : dayjs(response.data.ResponseData.AgreementStartDate).format(
                      "MM/DD/YYYY"
                    )
              );
              setFteAgreement(
                response.data.ResponseData.FTEAgreementTax === null
                  ? ""
                  : response.data.ResponseData.FTEAgreementTax
              );
              setEstimationWorkFlow(
                response.data.ResponseData.EstimatedWorkflow === null
                  ? ""
                  : response.data.ResponseData.EstimatedWorkflow
              );
              setVpnRequirement(
                response.data.ResponseData.VPNRequirement === null
                  ? ""
                  : response.data.ResponseData.VPNRequirement
              );
              setRemoteSystemAccess(
                response.data.ResponseData.RemoteSystemAccess === null
                  ? ""
                  : response.data.ResponseData.RemoteSystemAccess
              );
              setTaxPreparationSoftware(
                response.data.ResponseData.TaxPreparationSoftware === null
                  ? ""
                  : response.data.ResponseData.TaxPreparationSoftware
              );
              setDocumentPortal(
                response.data.ResponseData.DocumentPortal === null
                  ? ""
                  : response.data.ResponseData.DocumentPortal
              );
              setWorkflowTracker(
                response.data.ResponseData.WorkflowTracker === null
                  ? ""
                  : response.data.ResponseData.WorkflowTracker
              );
              setCommunicationChannel(
                response.data.ResponseData.CommunicationChannel === null
                  ? ""
                  : response.data.ResponseData.CommunicationChannel
              );
              setRecurringCall(
                response.data.ResponseData.RecurringCall === null
                  ? ""
                  : response.data.ResponseData.RecurringCall
              );
              setSpecificProcessStep(
                response.data.ResponseData.SpecificAdditionalProcessSteps ===
                  null
                  ? ""
                  : response.data.ResponseData.SpecificAdditionalProcessSteps
              );
              setClientTimeZone(
                response.data.ResponseData.ClientTimeZone === null
                  ? ""
                  : response.data.ResponseData.ClientTimeZone
              );
            } else {
              const data = response.data.Message;
              if (data === null) {
                Toast.error("Please try again later.");
              } else {
                Toast.error(data);
              }
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Failed Please try again.");
            } else {
              Toast.error(data);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };

      getClientById();
    }
    setErrorTrue();
    clearClientData();
  }, [clientData, onEdit, onOpen]);

  const settingWorkTypeData = () => {
    workTypeData.map((i: any) => {
      if (i.WorkTypeId === 1) {
        setAccountingId(i.ClientWorkTypeId);
        setAccounting(true);
        setIsAccountingOpen(true);
        setAccBillingType(i.BillingTypeId);
        setAccGroup(i.GroupIds);
        setAccLayout(i.LayoutId);
        setAccContHrs(i.ContractHrs);
        setAccActHrs(i.InternalHrs);
        setAccContHrsHasErr(true);
        setAccActHrsHasErr(true);
        setAccBillingHasErr(true);
        setAccGroupHasErr(true);
        setAccLayoutHasErr(true);
      }

      if (i.WorkTypeId === 2) {
        setAuditId(i.ClientWorkTypeId);
        setAudit(true);
        setIsAuditOpen(true);
        setAuditBillingType(i.BillingTypeId);
        setAuditGroup(i.GroupIds);
        setAuditLayout(i.LayoutId);
        setAuditContHrs(i.ContractHrs);
        setAuditActHrs(i.InternalHrs);
        setAuditContHrsHasErr(true);
        setAuditActHrsHasErr(true);
        setAuditBillingHasErr(true);
        setAuditGroupHasErr(true);
        setAuditLayoutHasErr(true);
      }

      if (i.WorkTypeId === 3) {
        setTaxId(i.ClientWorkTypeId);
        setTax(true);
        setIsTaxOpen(true);
        setTaxBillingType(i.BillingTypeId);
        setTaxGroup(i.GroupIds);
        setTaxLayout(i.LayoutId);
        setTaxContHrs(i.ContractHrs);
        setTaxActHrs(i.InternalHrs);
        setTaxContHrsHasErr(true);
        setTaxActHrsHasErr(true);
        setTaxBillingHasErr(true);
        setTaxGroupHasErr(true);
        setTaxLayoutHasErr(true);
      }
    });
  };

  useEffect(() => {
    workTypeData.length > 0 && settingWorkTypeData();
  }, [workTypeData]);

  const handleAccContHrs = (e: any) => {
    if (e.length <= 5) {
      setAccContHrs(e);
    }
  };

  const handleAccActualHrs = (e: any) => {
    if (e.length <= 5) {
      setAccActHrs(e);
    }
  };

  const handleAuditContHrs = (e: any) => {
    if (e.length <= 5) {
      setAuditContHrs(e);
    }
  };

  const handleAuditActHrs = (e: any) => {
    if (e.length <= 5) {
      setAuditActHrs(e);
    }
  };

  const handleTaxContHrs = (e: any) => {
    if (e.length <= 5) {
      setTaxContHrs(e);
    }
  };

  const handleTaxActHrs = (e: any) => {
    if (e.length <= 5) {
      setTaxActHrs(e);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    clientName.trim().length <= 0 && setClientError(true);
    address.trim().length <= 0 && setAddressError(true);
    email.trim().length <= 0 && setEmailError(true);

    if (accounting) {
      if (accBillingType <= 0) {
        setAccBillingErr(true);
      }
      if (accGroup.length === 0) {
        setAccGroupErr(true);
      }
      // if (accLayout <= 0) {
      //   setAccLayoutErr(true);
      // }

      if (accContHrs <= 0) {
        setAccContHrsErr(true);
        setAccContHrsErrMsg("Contracted Hours must be greater than 0.");
      } else if (
        accContHrs === "0" ||
        accContHrs === "00" ||
        accContHrs === "000" ||
        accContHrs === "0000" ||
        accContHrs === "00000" ||
        accContHrs === "-0" ||
        accContHrs === "-00" ||
        accContHrs === "-000" ||
        accContHrs === "-0000" ||
        accContHrs === "-00000"
      ) {
        setAccContHrsErr(true);
        setAccContHrsErrMsg(`Contracted Hours should not be ${accContHrs}.`);
        return false;
      } else if (
        accContHrs.toString().includes(".") ||
        accContHrs.toString().includes(",")
      ) {
        setAccContHrsErr(true);
        setAccContHrsErrMsg("Contracted Hours must be a valid value.");
        return false;
      }

      if (accActualHrs <= 0) {
        setAccActHrsErr(true);
        setAccActualHrsErrMsg("Internal Hours must be greater than 0.");
        // return false;
      } else if (Number(accActualHrs) > Number(accContHrs)) {
        setAccActHrsErr(true);
        setAccActualHrsErrMsg(
          "Internal Hours should be less than or equal to contracted hours."
        );
        return false;
      } else if (
        accActualHrs === "0" ||
        accActualHrs === "00" ||
        accActualHrs === "000" ||
        accActualHrs === "0000" ||
        accActualHrs === "00000" ||
        accActualHrs === "-0" ||
        accActualHrs === "-00" ||
        accActualHrs === "-000" ||
        accActualHrs === "-0000" ||
        accActualHrs === "-00000"
      ) {
        setAccActHrsErr(true);
        setAccActualHrsErrMsg(`Internal Hours should not be ${accActualHrs}.`);
        return false;
      } else if (
        accActualHrs.toString().includes(".") ||
        accActualHrs.toString().includes(",")
      ) {
        setAccActHrsErr(true);
        setAccActualHrsErrMsg("Internal Hours must be a valid value.");
        return false;
      }
    }

    if (audit) {
      if (auditBillingType <= 0) {
        setAuditBillingErr(true);
      }
      if (auditGroup.length === 0) {
        setAuditGroupErr(true);
      }
      // if (auditLayout <= 0) {
      //   setAuditLayoutErr(true);
      // }

      if (auditContHrs <= 0) {
        setAuditContHrsErr(true);
        setAuditContHrsErrMsg("Contracted Hours must be greater than 0.");
      } else if (
        auditContHrs === "0" ||
        auditContHrs === "00" ||
        auditContHrs === "000" ||
        auditContHrs === "0000" ||
        auditContHrs === "00000" ||
        auditContHrs === "-0" ||
        auditContHrs === "-00" ||
        auditContHrs === "-000" ||
        auditContHrs === "-0000" ||
        auditContHrs === "-00000"
      ) {
        setAuditContHrsErr(true);
        setAuditContHrsErrMsg(
          `Contracted Hours should not be ${auditContHrs}.`
        );
        return false;
      } else if (
        auditContHrs.toString().includes(".") ||
        auditContHrs.toString().includes(",")
      ) {
        setAuditContHrsErr(true);
        setAuditContHrsErrMsg("Contracted Hours must be a valid value.");
        return false;
      }

      if (auditActualHrs <= 0) {
        setAuditActHrsErr(true);
        setAuditActualHrsErrMsg("Internal Hours must be greater than 0.");
        // return false;
      } else if (Number(auditActualHrs) > Number(auditContHrs)) {
        setAuditActHrsErr(true);
        setAuditActualHrsErrMsg(
          "Internal Hours should be less than or equal to contracted hours."
        );
        return false;
      } else if (
        auditActualHrs === "0" ||
        auditActualHrs === "00" ||
        auditActualHrs === "000" ||
        auditActualHrs === "0000" ||
        auditActualHrs === "00000" ||
        auditActualHrs === "-0" ||
        auditActualHrs === "-00" ||
        auditActualHrs === "-000" ||
        auditActualHrs === "-0000" ||
        auditActualHrs === "-00000"
      ) {
        setAuditActHrsErr(true);
        setAuditActualHrsErrMsg(
          `Internal Hours should not be ${auditActualHrs}.`
        );
        return false;
      } else if (
        auditActualHrs.toString().includes(".") ||
        auditActualHrs.toString().includes(",")
      ) {
        setAuditActHrsErr(true);
        setAuditActualHrsErrMsg("Internal Hours must be a valid value.");
        return false;
      }
    }

    if (tax) {
      if (taxBillingType <= 0) {
        setTaxBillingErr(true);
      }
      if (taxGroup.length === 0) {
        setTaxGroupErr(true);
      }
      // if (taxLayout <= 0) {
      //   setTaxLayout(true);
      // }

      if (taxContHrs <= 0) {
        setTaxContHrsErr(true);
        setTaxContHrsErrMsg("Contracted Hours must be greater than 0.");
        // return false;
      } else if (
        taxContHrs === "0" ||
        taxContHrs === "00" ||
        taxContHrs === "000" ||
        taxContHrs === "0000" ||
        taxContHrs === "00000" ||
        taxContHrs === "-0" ||
        taxContHrs === "-00" ||
        taxContHrs === "-000" ||
        taxContHrs === "-0000" ||
        taxContHrs === "-00000"
      ) {
        setTaxContHrsErr(true);
        setTaxContHrsErrMsg(`Contracted Hours should not be ${taxContHrs}.`);
        return false;
      } else if (
        taxContHrs.toString().includes(".") ||
        taxContHrs.toString().includes(",")
      ) {
        setTaxContHrsErr(true);
        setTaxContHrsErrMsg("Contracted Hours must be a valid value.");
        return false;
      }

      if (taxActualHrs <= 0) {
        setTaxActHrsErr(true);
        setTaxActualHrsErrMsg("Internal Hours must be greater than 0.");
        // return false;
      } else if (Number(taxActualHrs) > Number(taxContHrs)) {
        setTaxActHrsErr(true);
        setTaxActualHrsErrMsg(
          "Internal Hours should be less than or equal to contracted hours."
        );
        return false;
      } else if (
        taxActualHrs === "0" ||
        taxActualHrs === "00" ||
        taxActualHrs === "000" ||
        taxActualHrs === "0000" ||
        taxActualHrs === "00000" ||
        taxActualHrs === "-0" ||
        taxActualHrs === "-00" ||
        taxActualHrs === "-000" ||
        taxActualHrs === "-0000" ||
        taxActualHrs === "-00000"
      ) {
        setTaxActHrsErr(true);
        setTaxActualHrsErrMsg(`Internal Hours should not be ${taxActualHrs}.`);
        return false;
      } else if (
        taxActualHrs.toString().includes(".") ||
        taxActualHrs.toString().includes(",")
      ) {
        setTaxActHrsErr(true);
        setTaxActualHrsErrMsg("Internal Hours must be a valid value.");
        return false;
      }
    }
    const accHasError =
      // accounting &&
      accContHrsHasErr &&
      accActualHrsHasErr &&
      accBillingHasErr &&
      accGroupHasErr;
    // && accLayoutHasErr;
    const auditHasError =
      // audit &&
      auditActualHrsHasErr &&
      auditContHrsHasErr &&
      auditBillingHasErr &&
      auditGroupHasErr;
    // && auditLayoutHasErr;
    const taxHasError =
      // tax &&
      taxActualHrsHasErr &&
      taxContHrsHasErr &&
      taxBillingHasErr &&
      taxGroupHasErr;
    // && taxLayoutHasErr;

    if (accounting && accHasError) {
      workTypeAccData.push({
        ClientWorkTypeId: accountingId,
        workTypeId: 1,
        billingTypeId: accBillingType,
        groupIds: accGroup,
        layoutId: 1,
        internalHrs: accActualHrs,
        contractHrs: accContHrs,
      });
    }

    if (audit && auditHasError) {
      workTypeAuditData.push({
        ClientWorkTypeId: auditId,
        WorkTypeId: 2,
        BillingTypeId: auditBillingType,
        GroupIds: auditGroup,
        LayoutId: 1,
        InternalHrs: auditActualHrs,
        ContractHrs: auditContHrs,
      });
    }

    if (tax && taxHasError) {
      workTypeTaxData.push({
        ClientWorkTypeId: taxId,
        WorkTypeId: 3,
        BillingTypeId: taxBillingType,
        GroupIds: taxGroup,
        LayoutId: 1,
        InternalHrs: taxActualHrs,
        ContractHrs: taxContHrs,
      });
    }

    if (
      emailHasError &&
      clientNameHasError &&
      addressHasError &&
      (tax || accounting || audit) &&
      accHasError &&
      auditHasError &&
      taxHasError
    ) {
      saveClient();
    } else if (
      emailHasError &&
      clientNameHasError &&
      addressHasError &&
      !accounting &&
      !audit &&
      !tax
    ) {
      Toast.error("Please Select at least one work type.");
    }
  };

  const setErrorTrue = () => {
    setClientError(true);
    setAddressError(true);
    setEmailError(true);
    settelError(true);

    setAccBillingErr(true);
    setAccGroupErr(true);
    // setAccLayoutErr(true);
    setAccContHrsErr(true);
    setAccActHrsErr(true);
    setAccActualHrsErrMsg("");
    setAccContHrsErrMsg("");

    setAuditBillingErr(true);
    setAuditGroupErr(true);
    // setAuditLayoutErr(true);
    setAuditContHrsErr(true);
    setAuditActHrsErr(true);
    setAuditActualHrsErrMsg("");
    setAuditContHrsErrMsg("");

    setTaxBillingErr(true);
    setTaxGroupErr(true);
    // setTaxLayoutErr(true);
    setTaxContHrsErr(true);
    setTaxActHrsErr(true);
    setTaxActualHrsErrMsg("");
    setTaxContHrsErrMsg("");
  };

  const clearClientData = () => {
    setId(0);
    setClientName("");
    setClientError(false);
    setClientNameHasError(false);
    setAddress("");
    setAddressError(false);
    setAddressHasError(false);
    setEmail("");
    setEmailError(false);
    settelError(false);
    setEmailHasError(false);
    setTel("");

    setAccountingId(0);
    setAccounting(false);
    setIsAccountingOpen(false);
    setAccBillingType(0);
    setAccBillingErr(false);
    // setAccBillingHasErr(false);
    setAccGroup([]);
    setAccGroupErr(false);
    // setAccGroupHasErr(false);
    // setAccLayout(0);
    // setAccLayoutErr(false);
    // setAccLayoutHasErr(false);
    setAccContHrs(0);
    setAccContHrsErr(false);
    // setAccContHrsHasErr(false);
    setAccActHrs(0);
    setAccActHrsErr(false);
    setAccActualHrsErrMsg("");
    setAccContHrsErrMsg("");
    // setAccActHrsHasErr(false);

    setAuditId(0);
    setAudit(false);
    setIsAuditOpen(false);
    setAuditBillingType(0);
    setAuditBillingErr(false);
    // setAuditBillingHasErr(false);
    setAuditGroup([]);
    setAuditGroupErr(false);
    // setAuditGroupHasErr(false);
    // setAuditLayout(0);
    // setAuditLayoutErr(false);
    // setAuditLayoutHasErr(false);
    setAuditContHrs(0);
    setAuditContHrsErr(false);
    // setAuditContHrsHasErr(false);
    setAuditActHrs(0);
    setAuditActHrsErr(false);
    setAuditActualHrsErrMsg("");
    setAuditContHrsErrMsg("");
    // setAuditActHrsHasErr(false);

    setTaxId(0);
    setTax(false);
    setIsTaxOpen(false);
    setTaxBillingType(0);
    setTaxBillingErr(false);
    // setTaxBillingHasErr(false);
    setTaxGroup([]);
    setTaxGroupErr(false);
    // setTaxGroupHasErr(false);
    // setTaxLayout(0);
    // setTaxLayoutErr(false);
    // setTaxLayoutHasErr(false);
    setTaxContHrs(0);
    setTaxContHrsErr(false);
    // setTaxContHrsHasErr(false);
    setTaxActHrs(0);
    setTaxActHrsErr(false);
    setTaxActualHrsErrMsg("");
    setTaxContHrsErrMsg("");
    // setTaxActHrsHasErr(false);

    setPocFields([
      {
        Name: null,
        email: null,
      },
    ]);
    setCpaName("");
    setCpaEmail("");
    setCpaMobileNo("");
    setCity("");
    setState(0);
    setZip("");
    setClientItPOCName("");
    setClientItPOCEmail("");
    setPabsPOCName("");
    setPabsBDM("");
    setPabsManagerAssigned("");
    setGroupEmail("");
    setSOPStatus("");
    setDateofImplementation("");
    setAgreementStartDate("");
    setFteAgreement("");
    setEstimationWorkFlow("");
    setVpnRequirement("");
    setRemoteSystemAccess("");
    setTaxPreparationSoftware("");
    setDocumentPortal("");
    setWorkflowTracker("");
    setCommunicationChannel("");
    setRecurringCall("");
    setSpecificProcessStep("");
    setClientTimeZone("");
    setIsAdditionalFieldsClicked(false);
    setIsAddClientClicked(true);
  };

  const saveClient = async () => {
    setLoader(true);
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    // common functon for adding additional field's data
    const getFieldValue = (condition: any, value: any) => {
      return condition && value.trim() !== "" ? value.trim() : null;
    };

    try {
      const workTypes = [];
      if (accounting)
        workTypes.push(workTypeAccData[workTypeAccData.length - 1]);
      if (audit)
        workTypes.push(workTypeAuditData[workTypeAuditData.length - 1]);
      if (tax) workTypes.push(workTypeTaxData[workTypeTaxData.length - 1]);

      const response = await axios.post(
        `${process.env.pms_api_url}/client/save`,
        {
          id: Id || 0,
          Name: clientName,
          email: email,
          contactNo: tel,
          address: address,
          isActive: true,

          WorkTypes: workTypes.length > 0 ? workTypes : null,

          OwnerAndCPAName: getFieldValue(isAdditionalFieldsClicked, cpaName),
          OwnerEmail: getFieldValue(isAdditionalFieldsClicked, cpaEmail),
          OwnerPhone: getFieldValue(isAdditionalFieldsClicked, cpaMobileNo),
          City: getFieldValue(isAdditionalFieldsClicked, city),
          StateId: isAdditionalFieldsClicked && state !== 0 ? state : null,
          Zip: getFieldValue(isAdditionalFieldsClicked, zip),

          ClientPOCInformation: isAdditionalFieldsClicked ? pocFields : [],

          ClientITPOCName: getFieldValue(
            isAdditionalFieldsClicked,
            clientItPOCName
          ),
          ClientITPOCEmail: getFieldValue(
            isAdditionalFieldsClicked,
            clientItPOCEmail
          ),
          PABSPOCName: getFieldValue(isAdditionalFieldsClicked, pabsPOCName),

          Pabsbdm: getFieldValue(isAdditionalFieldsClicked, pabsBDM),
          PabsManagerAssigned: getFieldValue(
            isAdditionalFieldsClicked,
            pabsManagerAssigned
          ),

          GroupMail: getFieldValue(isAdditionalFieldsClicked, groupEmail),
          SopStatus: getFieldValue(isAdditionalFieldsClicked, sopStatus),

          DateOfImplementation: getFieldValue(
            isAdditionalFieldsClicked,
            dateOfImplementation
          ),
          AgreementStartDate: getFieldValue(
            isAdditionalFieldsClicked,
            agreementStartDate
          ),
          FteAgreementTax: getFieldValue(
            isAdditionalFieldsClicked,
            fteAgreement
          ),
          EstimatedWorkflow: getFieldValue(
            isAdditionalFieldsClicked,
            estimationWorkflow
          ),
          VpnRequirement: getFieldValue(
            isAdditionalFieldsClicked,
            vpnRequirement
          ),
          RemoteSystemAccess: getFieldValue(
            isAdditionalFieldsClicked,
            remoteSystemAccess
          ),
          TaxPreparationSoftware: getFieldValue(
            isAdditionalFieldsClicked,
            taxPreparationSoftware
          ),
          DocumentPortal: getFieldValue(
            isAdditionalFieldsClicked,
            documentPortal
          ),
          WorkflowTracker: getFieldValue(
            isAdditionalFieldsClicked,
            workflowTracker
          ),
          CommunicationChannel: getFieldValue(
            isAdditionalFieldsClicked,
            communicationChannel
          ),
          RecurringCall: getFieldValue(
            isAdditionalFieldsClicked,
            recurringCall
          ),
          SpecificAdditionalProcessSteps: getFieldValue(
            isAdditionalFieldsClicked,
            specificProcessStep
          ),
          ClientTimeZone: getFieldValue(
            isAdditionalFieldsClicked,
            clientTimeZone
          ),
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          Toast.success(
            `Client ${onEdit ? "Updated" : "created"} successfully.`
          );
          setErrorTrue();
          clearClientData();
          onDataFetch();
          setLoader(false);
          {
            !addMoreClicked && onClose();
          }
        } else {
          setLoader(false);
          onClose();
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      } else {
        setLoader(false);
        onClose();
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Failed Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const clearAllData = async () => {
    await setErrorTrue();
    await clearClientData();
    onClose();
  };

  useImperativeHandle(ref, () => ({
    clearAllData,
  }));

  // Getting WorkTypes
  useEffect(() => {
    if (onOpen) {
      getWorkTypes();
      getBillingTypes();
      getLayoutTypes();
      getGroupTypes();
      getStates();
    }
  }, [onOpen]);

  const getWorkTypes = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/WorkType/GetDropdown`,
        {
          clientId: 0,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setWorkType(response.data.ResponseData);

          const workTypeLabels = response.data.ResponseData.map(
            (item: { label: any }) => item.label
          );
          setHasTax(workTypeLabels.includes("Tax"));
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBillingTypes = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/BillingType/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setBillingTypeData(response.data.ResponseData);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Failed Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getLayoutTypes = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/Layout/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setLayoutTypeData(response.data.ResponseData);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Failed Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getGroupTypes = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/group/getdropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setGroupTypeData(response.data.ResponseData);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Failed Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStates = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/state/getdropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setStateList(response.data.ResponseData);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Failed Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <span className="flex flex-row items-center px-[20px] py-[20px] gap-[20px]">
          <label
            onClick={() => {
              setIsAddClientClicked(true);
              setIsAdditionalFieldsClicked(false);
            }}
            className={`cursor-pointer select-none ${
              isAddClientClicked
                ? "text-secondary text-[16px] font-semibold"
                : "text-slatyGrey text-[14px]"
            }`}
          >
            Add Client
          </label>
          <span className="text-lightSilver">|</span>
          <label
            onClick={() => {
              setIsAdditionalFieldsClicked(true);
              setIsAddClientClicked(false);
            }}
            className={`cursor-pointer select-none ${
              isAdditionalFieldsClicked
                ? "text-secondary text-[16px] font-semibold"
                : "text-slatyGrey text-[14px]"
            }`}
          >
            Additional Fields
          </label>
        </span>
        <div className="flex gap-[20px] flex-col px-[20px] pb-[40px] max-h-[73.5vh] overflow-y-auto">
          {isAddClientClicked && (
            <>
              <Text
                label="Client Name"
                placeholder="Enter Client Name"
                validate
                value={clientName}
                getValue={(e) => setClientName(e)}
                getError={(e) => setClientNameHasError(e)}
                hasError={clientError}
                autoComplete="off"
                minChar={5}
                maxChar={50}
              />
              <Textarea
                label="Address"
                placeholder="Enter Address"
                validate
                value={address}
                getValue={(e) => setAddress(e)}
                getError={(e) => setAddressHasError(e)}
                hasError={addressError}
                autoComplete="off"
                maxChar={300}
                rows={1}
              />
              <Email
                label="Email"
                type="email"
                placeholder="Enter Email ID"
                validate
                value={email}
                getValue={(e) => setEmail(e)}
                getError={(e) => setEmailHasError(e)}
                hasError={emailError}
                autoComplete="off"
                minChar={5}
                maxChar={100}
              />
              <Tel
                className="telPadding"
                value={tel}
                getValue={(e) => setTel(e)}
                hasError={telError}
                placeholder="Enter Mobile No."
                label="Mobile Number"
                maxLength={14}
                getError={() => {}}
              />

              {/* Taxation Section */}
              <div>
                <label
                  className={`flex items-center justify-between cursor-pointer`}
                  htmlFor="Tax"
                >
                  <span className="flex items-center">
                    <CheckBox
                      checked={tax}
                      id="Tax"
                      label="Tax"
                      onChange={toggleTaxAccordion}
                    />
                  </span>
                  {isTaxOpen ? (
                    <span
                      className={`transition-transform duration-300 transform rotate-180`}
                    >
                      <ChevronDownIcon />
                    </span>
                  ) : (
                    <span
                      className={`transition-transform duration-300 transform rotate-0`}
                    >
                      <ChevronDownIcon />
                    </span>
                  )}
                </label>
                <div
                  className={`${
                    isTaxOpen
                      ? "max-h-[430px] transition-all duration-700 pt-[10px]"
                      : "max-h-0 transition-all duration-700"
                  } overflow-hidden`}
                >
                  <div className="flex flex-col gap-[17px] pl-[34px]">
                    <Select
                      id="billing_type"
                      label="Billing Type"
                      defaultValue={taxBillingType}
                      options={billingTypeData}
                      onSelect={() => {}}
                      getValue={(e) => {
                        e > 0 && setTaxBillingErr(false);
                        setTaxBillingType(e);
                      }}
                      getError={(e) => setTaxBillingHasErr(e)}
                      hasError={taxBillingErr}
                      validate
                      errorClass="!-mt-[15px]"
                    />
                    <MultiSelectChip
                      type="checkbox"
                      id="Group"
                      label="Group"
                      defaultValue={taxGroup}
                      options={groupTypeData}
                      onSelect={() => {}}
                      getValue={(e) => setTaxGroup(e)}
                      getError={(e) => setTaxGroupHasErr(e)}
                      hasError={taxGroupErr}
                      validate
                      errorClass="!-mt-[15px]"
                    />
                    {/* <Select
                    id="Layout"
                    label="Layout"
                    defaultValue={taxLayout}
                    options={layoutTypeData}
                    onSelect={() => {}}
                    getValue={(e) => setTaxLayout(e)}
                    getError={(e) => setTaxLayoutHasErr(e)}
                    hasError={taxLayoutErr}
                    validate
                    errorClass="!-mt-[15px]"
                  /> */}
                    <Text
                      className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      label="Contracted Hours"
                      placeholder="Enter Total Contracted Hours"
                      validate
                      maxLength={5}
                      value={taxContHrs === 0 ? "" : taxContHrs}
                      getValue={(e) => handleTaxContHrs(e)}
                      getError={(e) => setTaxContHrsHasErr(e)}
                      hasError={taxContHrsErr}
                      errorMessage={taxContHrsErrMsg}
                      noText
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <Text
                      className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      label="Internal Hours"
                      placeholder="Enter Total Internal Hours"
                      validate
                      maxLength={5}
                      value={taxActualHrs === 0 ? "" : taxActualHrs}
                      getValue={(e) => handleTaxActHrs(e)}
                      getError={(e) => setTaxActHrsHasErr(e)}
                      hasError={taxActualHrsErr}
                      errorMessage={taxActualHrsErrMsg}
                      noText
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>
                </div>
              </div>

              {/* Accounting Section */}
              <div>
                <label
                  className={`flex items-center justify-between cursor-pointer`}
                  htmlFor="Accounting"
                >
                  <span className="flex items-center">
                    <CheckBox
                      checked={accounting}
                      id="Accounting"
                      label="Accounting"
                      onChange={toggleAccountingAccordion}
                    />
                  </span>
                  {isAccountingOpen ? (
                    <span
                      className={`transition-transform duration-300 transform rotate-180`}
                    >
                      <ChevronDownIcon />
                    </span>
                  ) : (
                    <span
                      className={`transition-transform duration-300 transform rotate-0`}
                    >
                      <ChevronDownIcon />
                    </span>
                  )}
                </label>
                <div
                  className={`${
                    isAccountingOpen
                      ? "max-h-[430px] transition-all duration-700 pt-[10px]"
                      : "max-h-0 transition-all duration-700"
                  } overflow-hidden`}
                >
                  <div className="flex flex-col gap-[17px] pl-[34px]">
                    <Select
                      id="billing_type"
                      label="Billing Type"
                      defaultValue={accBillingType}
                      options={billingTypeData}
                      onSelect={() => {}}
                      getValue={(e) => {
                        e > 0 && setAccBillingErr(false);
                        setAccBillingType(e);
                      }}
                      getError={(e) => setAccBillingHasErr(e)}
                      hasError={accBillingErr}
                      validate
                      errorClass="!-mt-[15px]"
                      search
                    />
                    <MultiSelectChip
                      type="checkbox"
                      id="group"
                      label="Group"
                      defaultValue={accGroup}
                      options={groupTypeData}
                      onSelect={() => {}}
                      getValue={(e) => setAccGroup(e)}
                      getError={(e) => setAccGroupHasErr(e)}
                      hasError={accGroupErr}
                      validate
                      errorClass="!-mt-[15px]"
                    />
                    {/* <Select
                  id="layout"
                  label="Layout"
                  defaultValue={accLayout}
                  options={layoutTypeData}
                  onSelect={() => {}}
                  getValue={(e) => setAccLayout(e)}
                  getError={(e) => setAccLayoutHasErr(e)}
                  hasError={accLayoutErr}
                  validate
                  errorClass="!-mt-[15px]"
                /> */}
                    <Text
                      className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      label="Contracted Hours"
                      placeholder="Enter Total Contracted Hours"
                      validate
                      maxLength={5}
                      maxChar={5}
                      value={accContHrs === 0 ? "" : accContHrs}
                      getValue={(e) => handleAccContHrs(e)}
                      getError={(e) => setAccContHrsHasErr(e)}
                      hasError={accContHrsErr}
                      errorMessage={accContHrsErrMsg}
                      noText
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <Text
                      className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      label="Internal Hours"
                      placeholder="Enter Total Internal Hours"
                      validate
                      maxLength={5}
                      value={accActualHrs === 0 ? "" : accActualHrs}
                      getValue={(e) => handleAccActualHrs(e)}
                      getError={(e) => setAccActHrsHasErr(e)}
                      hasError={accActualHrsErr}
                      errorMessage={accActualHrsErrMsg}
                      noText
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>
                </div>
              </div>

              {/* Audit Section */}
              <div>
                <label
                  className={`flex items-center justify-between cursor-pointer`}
                  htmlFor="Audit"
                >
                  <span className="flex items-center">
                    <CheckBox
                      checked={audit}
                      id="Audit"
                      label="Audit"
                      onChange={toggleAuditAccordion}
                    />
                  </span>
                  {isAuditOpen ? (
                    <span
                      className={`transition-transform duration-300 transform rotate-180`}
                    >
                      <ChevronDownIcon />
                    </span>
                  ) : (
                    <span
                      className={`transition-transform duration-300 transform rotate-0`}
                    >
                      <ChevronDownIcon />
                    </span>
                  )}
                </label>
                <div
                  className={`${
                    isAuditOpen
                      ? "max-h-[430px] transition-all duration-700 pt-[10px]"
                      : "max-h-0 transition-all duration-700"
                  } overflow-hidden`}
                >
                  <div className="flex flex-col gap-[17px] pl-[34px]">
                    <Select
                      id="billing_type"
                      label="Billing Type"
                      defaultValue={auditBillingType}
                      options={billingTypeData}
                      onSelect={() => {}}
                      getValue={(e) => {
                        e > 0 && setAuditBillingErr(false);
                        setAuditBillingType(e);
                      }}
                      getError={(e) => setAuditBillingHasErr(e)}
                      hasError={auditBillingErr}
                      validate
                      errorClass="!-mt-[15px]"
                    />
                    <MultiSelectChip
                      type="checkbox"
                      id="Group"
                      label="Group"
                      defaultValue={auditGroup}
                      options={groupTypeData}
                      onSelect={() => {}}
                      getValue={(e) => setAuditGroup(e)}
                      getError={(e) => setAuditGroupHasErr(e)}
                      hasError={auditGroupErr}
                      validate
                      errorClass="!-mt-[15px]"
                    />
                    {/* <Select
                  id="Layout"
                  label="Layout"
                  defaultValue={auditLayout}
                  options={layoutTypeData}
                  onSelect={() => {}}
                  getValue={(e) => setAuditLayout(e)}
                  getError={(e) => setAuditLayoutHasErr(e)}
                  hasError={auditLayoutErr}
                  validate
                  errorClass="!-mt-[15px]"
                /> */}
                    <Text
                      className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      label="Contracted Hours"
                      placeholder="Enter Total Contracted Hours"
                      validate
                      maxLength={5}
                      value={auditContHrs === 0 ? "" : auditContHrs}
                      getValue={(e) => handleAuditContHrs(e)}
                      getError={(e) => setAuditContHrsHasErr(e)}
                      hasError={auditContHrsErr}
                      errorMessage={auditContHrsErrMsg}
                      noText
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                    <Text
                      className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      type="number"
                      label="Internal Hours"
                      placeholder="Enter Total Internal Hours"
                      validate
                      maxLength={5}
                      value={auditActualHrs === 0 ? "" : auditActualHrs}
                      getValue={(e) => handleAuditActHrs(e)}
                      getError={(e) => setAuditActHrsHasErr(e)}
                      hasError={auditActualHrsErr}
                      errorMessage={auditActualHrsErrMsg}
                      noText
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {isAdditionalFieldsClicked && (
            <>
              <div className="flex flex-row gap-5">
                <Text
                  label="Owner/CPA Name"
                  placeholder="Enter Owner/CPA Name"
                  value={cpaName}
                  getValue={(e) => setCpaName(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <Email
                  label="CPA Email"
                  type="email"
                  placeholder="Enter CPA Email"
                  value={cpaEmail}
                  getValue={(e) => setCpaEmail(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-row gap-5">
                <Tel
                  label="CPA Mobile Number"
                  placeholder="Enter CPA Mobile No."
                  value={cpaMobileNo}
                  getValue={(e) => setCpaMobileNo(e)}
                  getError={() => {}}
                  autoComplete="off"
                  maxLength={14}
                />

                <Text
                  label="City"
                  placeholder="Enter City"
                  value={city}
                  getValue={(e) => setCity(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-row gap-5">
                <Select
                  id="State"
                  label="State"
                  defaultValue={state}
                  options={stateList}
                  getValue={(e) => setState(e)}
                  getError={(e) => {}}
                />

                <Text
                  label="ZIP Code"
                  placeholder="Enter ZIP Code"
                  type="number"
                  value={zip}
                  getValue={(e) => setZip(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              {pocFields.map(
                (
                  field: {
                    Name: string | undefined;
                    Email: string | undefined;
                  },
                  index: any
                ) => (
                  <div className="flex flex-row" key={index}>
                    <div className="flex gap-5 w-full">
                      <Text
                        label="Client POC Name"
                        placeholder="Enter Client POC Name"
                        value={field.Name}
                        getValue={(e) => handleClientPOCNameChange(e, index)}
                        getError={() => {}}
                        autoComplete="off"
                      />

                      <Email
                        label="CPA Email"
                        type="Email"
                        placeholder="Enter CPA Email"
                        value={field.Email}
                        getValue={(e) => handleClientPOCEmailChange(e, index)}
                        getError={() => {}}
                        autoComplete="off"
                      />
                    </div>

                    {index === 0 ? (
                      <span className="cursor-pointer" onClick={addTaskField}>
                        <svg
                          className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px]  mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                          focusable="false"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          data-testid="AddIcon"
                        >
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                        </svg>
                      </span>
                    ) : (
                      <span
                        className="cursor-pointer"
                        onClick={() => removePocField(index)}
                      >
                        <svg
                          className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px]  mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                          focusable="false"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          data-testid="RemoveIcon"
                        >
                          <path d="M19 13H5v-2h14v2z"></path>
                        </svg>
                      </span>
                    )}
                  </div>
                )
              )}

              <div className="flex flex-row gap-5">
                <Text
                  label="Client IT POC Name"
                  placeholder="Enter Client IT POC Name"
                  value={clientItPOCName}
                  getValue={(e) => setClientItPOCName(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <Email
                  label="Client IT POC Email"
                  type="email"
                  placeholder="Enter Client IT POC Email"
                  value={clientItPOCEmail}
                  getValue={(e) => setClientItPOCEmail(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-row gap-5">
                <Text
                  label="PABS POC Name"
                  placeholder="Enter PABS POC Name"
                  value={pabsPOCName}
                  getValue={(e) => setPabsPOCName(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <Text
                  label="PABS BDM"
                  placeholder="Enter PABS BDM"
                  value={pabsBDM}
                  getValue={(e) => setPabsBDM(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-row gap-5">
                <Text
                  label="PABS MANAGER Assigned"
                  placeholder="Enter PABS MANAGER Assigned"
                  value={pabsManagerAssigned}
                  getValue={(e) => setPabsManagerAssigned(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <Email
                  label="Group Email"
                  type="email"
                  placeholder="Enter Group Email"
                  value={groupEmail}
                  getValue={(e) => setGroupEmail(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex gap-5">
                <Text
                  label="SOP Status"
                  placeholder="Enter SOP Status"
                  value={sopStatus}
                  getValue={(e) => setSOPStatus(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <span className="w-full">
                  <Datepicker
                    label="Date Of Implementation"
                    startYear={1990}
                    endYear={2080}
                    value={dateOfImplementation}
                    getValue={(e) => setDateofImplementation(e)}
                    id="Date Of Implementation"
                    getError={() => {}}
                    format="mm/dd/yyyy"
                  />
                </span>
              </div>

              <div className="flex gap-5">
                <span className="w-full">
                  <Datepicker
                    label="Agreement Start Date"
                    startYear={1990}
                    endYear={2080}
                    value={agreementStartDate}
                    getValue={(e) => setAgreementStartDate(e)}
                    id="Agreement Start Date"
                    getError={() => {}}
                    format="mm/dd/yyyy"
                  />
                </span>

                <Text
                  label="FTE Agreement (Tax)"
                  placeholder="Enter FTE Agreement (Tax)"
                  value={fteAgreement}
                  getValue={(e) => setFteAgreement(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-row gap-5">
                <Text
                  label="Estimation Workflow"
                  placeholder="Enter Estimation Workflow"
                  value={estimationWorkflow}
                  getValue={(e) => setEstimationWorkFlow(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <Text
                  label="VPN Requirement"
                  placeholder="Enter VPN Requirement"
                  value={vpnRequirement}
                  getValue={(e) => setVpnRequirement(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-row gap-5">
                <Text
                  label="Remote System Access"
                  placeholder="Enter Remote System Access"
                  value={remoteSystemAccess}
                  getValue={(e) => setRemoteSystemAccess(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <Text
                  label="Tax Preparation Software"
                  placeholder="Enter Tax Preparation Software"
                  value={taxPreparationSoftware}
                  getValue={(e) => setTaxPreparationSoftware(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-row gap-5">
                <Text
                  label="Document Portal"
                  placeholder="Enter Document Portal"
                  value={documentPortal}
                  getValue={(e) => setDocumentPortal(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <Text
                  label="Workflow Tracker"
                  placeholder="Enter Workflow Tracker"
                  value={workflowTracker}
                  getValue={(e) => setWorkflowTracker(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-row gap-5">
                <Text
                  label="Communication Channel"
                  placeholder="Enter Communication Channel"
                  value={communicationChannel}
                  getValue={(e) => setCommunicationChannel(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <Text
                  label="Recurring Call"
                  placeholder="Enter Recurring Call"
                  value={recurringCall}
                  getValue={(e) => setRecurringCall(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-row gap-5">
                <Text
                  label="Specific Additional Process Step"
                  placeholder="Enter Specific Additional Process Step"
                  value={specificProcessStep}
                  getValue={(e) => setSpecificProcessStep(e)}
                  getError={() => {}}
                  autoComplete="off"
                />

                <Text
                  label="Client Timezone"
                  placeholder="Enter Client Timezone"
                  value={clientTimeZone}
                  getValue={(e) => setClientTimeZone(e)}
                  getError={() => {}}
                  autoComplete="off"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
          {onEdit ? (
            <Button
              variant="btn-outline-primary"
              className="rounded-[4px] !h-[36px]"
              onClick={() => {
                clearAllData();
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="btn-outline-primary"
              className="rounded-[4px] !h-[36px]"
              type="submit"
              onClick={() => setAddMoreClicked(true)}
            >
              Add More
            </Button>
          )}
          {loader ? (
            <span className="-mt-1">
              <Loader size="sm" />
            </span>
          ) : (
            <Button
              variant="btn-primary"
              className="rounded-[4px] !h-[36px]"
              type="submit"
            >
              {onEdit
                ? "Save"
                : `Create ${tab === "Permissions" ? "Role" : tab}`}
            </Button>
          )}
        </div>
      </form>
    </>
  );
});

export default ClientContent;
