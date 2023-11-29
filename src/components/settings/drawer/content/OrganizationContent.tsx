/* eslint-disable react/display-name */
// import { getHeaderOptions } from "@/utils/commonFunction";
import axios from "axios";
import { Button, Loader, Switch, Text, Toast, Typography } from "next-ts-lib";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface OrganizationContentRef {
  clearOrganizationData: () => void;
}

const OrganizationContent = forwardRef<
  OrganizationContentRef,
  {
    tab: string;
    onEdit: boolean;
    orgData: any;
    onClose: () => void;
    onDataFetch: any;
    getOrgDetailsFunction: any;
  }
>(
  (
    { tab, onEdit, orgData, onClose, onDataFetch, getOrgDetailsFunction },
    ref
  ) => {
    const token = localStorage.getItem("token");
    const [responseData, setResponseData] = useState([]);
    const [organizationId, setOrganizationId] = useState(0);
    const [clientName, setClientName] = useState("");
    const [clientNameError, setClientNameError] = useState(false);
    const [clientNameHasError, setClientNameHasError] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projectNameError, setProjectNameError] = useState(false);
    const [projectNameHasError, setProjectNameHasError] = useState(false);
    const [processName, setProcessName] = useState("");
    const [processNameError, setProcessNameError] = useState(false);
    const [processNameHasError, setProcessNameHasError] = useState(false);
    const [subProcessName, setSubProcessName] = useState("");
    const [subProcessNameError, setSubProcessNameError] = useState(false);
    const [subProcessNameHasError, setSubProcessNameHasError] = useState(false);
    const [organizationName, setOrganizationName] = useState("");
    const [organizationNameError, setOrganizationNameError] = useState(false);
    const [organizationNameHasError, setOrganizationNameHasError] =
      useState(false);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
      setClientName("Client");
      setClientNameError(true);
      setProjectName("Project");
      setProjectNameError(true);
      setProcessName("Process");
      setProcessNameError(true);
      setSubProcessName("SubProcess");
      setSubProcessNameError(true);
    }, []);

    useEffect(() => {
      if (orgData && onEdit) {
        setOrganizationId(orgData.OrganizationId);
        setOrganizationName(orgData.OrganizationName);
        setOrganizationNameError(true);
        setClientName(orgData.ClientModuleName);
        setClientNameError(true);
        setProjectName(orgData.ProjectModuleName);
        setProjectNameError(true);
        setProcessName(orgData.ProcessModuleName);
        setProcessNameError(true);
        setSubProcessName(orgData.SubProcessModuleName);
        setSubProcessNameError(true);
      } else {
        setOrganizationId(0);
        setOrganizationName("");
        setClientName("");
        setProjectName("");
        setProcessName("");
        setSubProcessName("");
      }
    }, [orgData, onEdit]);

    const clear = () => {
      setResponseData([]);
      setOrganizationId(0);
      setClientName("");
      setClientNameHasError(false);
      setClientNameError(false);
      setProjectName("");
      setProjectNameHasError(false);
      setProjectNameError(false);
      setProcessName("");
      setProcessNameError(false);
      setProcessNameHasError(false);
      setSubProcessName("");
      setSubProcessNameError(false);
      setSubProcessNameHasError(false);
      setOrganizationName("");
      setOrganizationNameError(false);
      setOrganizationNameHasError(false);
    };

    const setDataErrorTrue = () => {
      setOrganizationNameHasError(true);
      setSubProcessNameHasError(true);
      setProcessNameHasError(true);
      setClientNameHasError(true);
      setProjectNameHasError(true);
    };

    const clearOrganizationData = async () => {
      await setDataErrorTrue();
      await clear();
      onClose();
    };

    useImperativeHandle(ref, () => ({
      clearOrganizationData,
    }));

    const handleSubmit = async (e: any) => {
      e.preventDefault();

      clientName.trim().length <= 0 && setClientNameHasError(true);
      organizationName.trim().length <= 0 && setOrganizationNameHasError(true);
      processName.trim().length <= 0 && setProcessNameHasError(true);
      projectName.trim().length <= 0 && setProjectNameHasError(true);
      subProcessName.trim().length <= 0 && setSubProcessNameHasError(true);

      if (
        organizationNameError &&
        subProcessNameError &&
        processNameError &&
        clientNameError &&
        projectNameError
      ) {
        setLoader(true);
        try {
          const headers = {
            "Content-Type": "application/json",
            Authorization: token,
          };
          const param = {
            OrganizationId: onEdit || 0,
            OrganizationName: organizationName,
            ClientModuleName: clientName,
            ProjectModuleName: projectName,
            ProcessModuleName: processName,
            SubProcessModuleName: subProcessName,
          };
          const response = await axios.post(
            `${process.env.pms_api_url}/organization/save`,
            param,
            { headers: headers }
          );
          if (response.data.ResponseStatus === "Success") {
            setResponseData(response.data.ResponseData);
            Toast.success(
              `Organization ${onEdit ? "Updated" : "created"}  successfully!`
            );
            clearOrganizationData();
            getOrgDetailsFunction();
            onClose();
            onDataFetch();
            setLoader(false);
          } else {
            setLoader(false);
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
        } catch (error) {
          setLoader(false);
          console.error(error);
        }
      }
    };

    const addMoreSubmit = async (e: any) => {
      e.preventDefault();

      clientName.trim().length <= 0 && setClientNameHasError(true);
      organizationName.trim().length <= 0 && setOrganizationNameHasError(true);
      processName.trim().length <= 0 && setProcessNameHasError(true);
      projectName.trim().length <= 0 && setProjectNameHasError(true);
      subProcessName.trim().length <= 0 && setSubProcessNameHasError(true);

      if (
        organizationNameError &&
        subProcessNameError &&
        processNameError &&
        clientNameError &&
        projectNameError
      ) {
        try {
          const headers = {
            "Content-Type": "application/json",
            Authorization: token,
          };
          const param = {
            OrganizationId: onEdit || 0,
            OrganizationName: organizationName,
            ClientModuleName: clientName,
            ProjectModuleName: projectName,
            ProcessModuleName: processName,
            SubProcessModuleName: subProcessName,
          };
          const response = await axios.post(
            `${process.env.pms_api_url}/organization/save`,
            param,
            { headers: headers }
          );
          if (response.data.ResponseStatus === "Success") {
            setResponseData(response.data.ResponseData);
            Toast.success(
              `Organization ${onEdit ? "Updated" : "created"}  successfully!`
            );
            clearOrganizationData();
            getOrgDetailsFunction();
            onDataFetch();
          } else {
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    const handleOrganizationChange = (value: any) => {
      if (value.length <= 50) {
        setOrganizationNameError(false);
        setOrganizationName(value);
      }
    };

    useEffect(() => {
      setClientName("Client");
      setProjectName("Project");
      setProcessName("Process");
      setSubProcessName("SubProcess");
    }, []);

    return (
      <form className="max-h-[78vh] overflow-y-auto">
        <div className="flex gap-[20px] flex-col p-[20px]">
          <Text
            getValue={(value: any) => handleOrganizationChange(value)}
            label="Organization Name"
            placeholder="PABS"
            getError={(e) => setOrganizationNameError(e)}
            hasError={organizationNameHasError}
            noSpecialChar
            minChar={3}
            value={organizationName}
            validate
          />
        </div>
        <div className="moduleOrg px-5">
          <div className="flex moduleOrgHeader font-semibold justify-between items-center py-3">
            <Typography type="title" className="font-medium">
              Default Name
            </Typography>
            <Typography type="title" className="font-medium">
              Display Name
            </Typography>
          </div>
          <div className="flex moduleOrgHeader font-semibold justify-between items-center py-3">
            <Typography type="sub-subtitle" className="font-medium">
              Clients
            </Typography>
            <div className="max-w-[150px]">
              <Text
                noSpecialChar
                getValue={(e: any) => setClientName(e)}
                placeholder="Clients"
                getError={(e) => setClientNameError(e)}
                hasError={clientNameHasError}
                value={clientName}
                validate
              />
            </div>
          </div>
          <div className="flex moduleOrgHeader font-semibold justify-between items-center py-3">
            <Typography type="sub-subtitle" className="font-medium">
              Project
            </Typography>
            <div className="max-w-[150px]">
              <Text
                noSpecialChar
                getValue={(e: any) => setProjectName(e)}
                placeholder="Project"
                getError={(e) => setProjectNameError(e)}
                hasError={projectNameHasError}
                value={projectName}
                validate
              />
            </div>
          </div>
          <div className="flex moduleOrgHeader font-semibold justify-between items-center py-3">
            <Typography type="sub-title" className="font-medium">
              Process
            </Typography>
            <div className="max-w-[150px]">
              <Text
                noSpecialChar
                getValue={(e: any) => setProcessName(e)}
                placeholder="Process"
                getError={(e) => setProcessNameError(e)}
                hasError={processNameHasError}
                value={processName}
                validate
              />
            </div>
          </div>
          <div className="flex moduleOrgHeader font-semibold justify-between items-center py-3">
            <Typography type="sub-title" className="font-medium">
              SubProcess
            </Typography>
            <div className="max-w-[150px]">
              <Text
                noSpecialChar
                getValue={(e: any) => setSubProcessName(e)}
                placeholder="Subprocess"
                getError={(e) => setSubProcessNameError(e)}
                hasError={subProcessNameHasError}
                validate
                value={subProcessName}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
          <>
            {onEdit ? (
              <Button
                variant="btn-outline-primary"
                className="rounded-[4px] !h-[36px] !uppercase"
                onClick={() => {
                  clearOrganizationData();
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="btn-outline-primary"
                className="rounded-[4px] !h-[36px] !uppercase"
                onClick={addMoreSubmit}
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
                className="rounded-[4px] !h-[36px] !uppercase"
                type="submit"
                onClick={handleSubmit}
              >
                {onEdit ? "Save" : "Create Organization"}
              </Button>
            )}
          </>
        </div>
      </form>
    );
  }
);

export default OrganizationContent;
