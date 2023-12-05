/* eslint-disable react/display-name */
import DeleteModal from "@/components/common/DeleteModal";
import axios from "axios";
import { Button, Loader, Select, Text, Toast } from "next-ts-lib";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface ProjectContentRef {
  clearAllData: () => void;
}

const ProjectContent = forwardRef<
  ProjectContentRef,
  {
    tab: string;
    onEdit: boolean;
    onClose: () => void;
    projectData: any;
    onDataFetch: any;
    onValuesChange: any;
  }
>(({ tab, onEdit, onClose, projectData, onDataFetch, onValuesChange }, ref) => {
  const [textFieldOpen, setTextFieldOpen] = useState(false);
  const [addMoreClicked, setAddMoreClicked] = useState(false);

  const [client, setClient] = useState(0);
  const [clientError, setClientError] = useState(false);
  const [clientHasError, setClientHasError] = useState(false);
  const [clientDrpdown, setClientDrpdown] = useState([]);
  const [project, setProject] = useState(0);
  const [projectError, setProjectError] = useState(false);
  const [projectHasError, setProjectHasError] = useState(false);
  const [projectDrpdown, setProjectDrpdown] = useState([]);
  const [subProject, setSubProject] = useState("");

  const [subProjectId, setSubProjectId] = useState(null);

  const [projectLabel, setProjectLabel] = useState("");
  const [projectValue, setProjectValue] = useState<any>(0);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.get(
          `${process.env.pms_api_url}/client/getdropdown`,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setClientDrpdown(response.data.ResponseData);
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

    getData();
  }, []);

  useEffect(() => {
    if (onEdit) {
      const getData = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.pms_api_url}/project/getbyid`,
            {
              ProjectId: onEdit,
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
              const data = await response.data.ResponseData;
              setClient(data.ClientId);
              setProjectValue(data.ProjectId);
              setSubProject(data.SubProjectName);
              setSubProjectId(data.SubProjectId);
              setClientError(true);
              setProjectError(true);
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

      getData();
    } else {
      setClient(0);
      setClientError(false);
      setClientHasError(false);
      setProjectValue(0);
      setProjectError(false);
      setProjectHasError(false);
      setSubProject("");
      setTextFieldOpen(false);
      // setAddProjectName("");
      // setAddProjectNameError(false);
      // setAddProjectNameHasError(false);
      setSubProjectId(null);
    }
    setDataTrue();
    clearAllFields();
  }, [onEdit, onClose]);

  const getData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      let response = await axios.post(
        `${process.env.pms_api_url}/project/getdropdown`,
        {
          ClientId: client,
          SelectAll: true,
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
          setProjectDrpdown(response.data.ResponseData.List);
          setProjectValue(
            response.data.ResponseData.List.length === 1
              ? response.data.ResponseData.List[0].value
              : 0
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
          Toast.error("Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, [client]);

  const setDataTrue = () => {
    setClientHasError(true);
    setProjectHasError(true);
    // setAddProjectNameHasError(true);
  };

  const clearAllFields = () => {
    setClient(0);
    setClientError(false);
    setClientHasError(false);
    setProjectValue(0);
    setProjectError(false);
    setProjectHasError(false);
    setSubProject("");
    setTextFieldOpen(false);
    setProjectLabel("");
  };

  const clearAllData = async () => {
    onClose();
    setAddMoreClicked(false);
    await setDataTrue();
    await clearAllFields();
  };

  useImperativeHandle(ref, () => ({
    clearAllData,
  }));

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    client <= 0 && setClientHasError(true);
    projectValue <= 0 && setProjectHasError(true);

    if (
      clientError &&
      projectError &&
      projectValue > 0 &&
      subProject !== null &&
      subProject.trim().length > 0
    ) {
      setLoader(true);
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.post(
          `${process.env.pms_api_url}/project/savesubproject`,
          {
            SubProjectId: subProjectId,
            SubProjectName: subProject.trim(),
            ProjectId: projectValue,
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
              `Project ${onEdit ? "Updated" : "created"} successfully.`
            );
            await setDataTrue();
            await clearAllFields();
            await onDataFetch();
            setLoader(false);
            {
              !addMoreClicked && onClose();
            }
          } else {
            setLoader(false);
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
        } else {
          setLoader(false);
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again.");
          } else {
            Toast.error(data);
          }
        }
      } catch (error) {
        setLoader(false);
        console.error(error);
      }
    } else if (client > 0 && projectValue > 0) {
      !addMoreClicked && onClose();
      onDataFetch();
    }
  };

  const handleAddProject = async () => {
    client <= 0 && setClientHasError(true);

    if (clientError && projectLabel.length > 0) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.post(
          `${process.env.pms_api_url}/project/saveproject`,
          {
            ClientId: client,
            ProjectId: projectValue !== 0 ? projectValue : null,
            ProjectName: projectLabel.trim(),
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
              `Project ${
                projectValue === 0 ||
                projectValue === null ||
                projectValue === "" ||
                projectValue === undefined
                  ? "created"
                  : "Updated"
              } successfully.`
            );
            getData();
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
    }
  };

  const handleAddNewProject = (editing: boolean) => {
    handleAddProject();
  };

  const handleValueChange = (isDeleteOpen: any, selectedRowId: boolean) => {
    onValuesChange(isDeleteOpen, selectedRowId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-[20px] flex-col p-[20px] max-h-[78.5vh]">
        <Select
          label="Client Name"
          id="client_name"
          validate
          errorClass="!-mt-4"
          placeholder="Select Client Name"
          defaultValue={client === 0 ? "" : client}
          onSelect={() => {}}
          options={clientDrpdown}
          hasError={clientHasError}
          getValue={(e) => {
            setClient(e);
            e > 0 && setClientHasError(false);
            // setProjectValue(0);
            // setProjectHasError(false);
          }}
          getError={(e) => setClientError(e)}
        />
        <Select
          label="Project Name"
          id="project_name"
          errorClass="!-mt-4"
          placeholder="Select Project Name"
          validate
          defaultValue={projectValue === 0 ? "" : projectValue}
          onSelect={() => {}}
          options={projectDrpdown}
          hasError={projectHasError}
          getValue={(e) => {
            setProjectValue(e);
            e > 0 && setProjectHasError(false);
          }}
          getError={(e) => setProjectError(e)}
          addDynamicForm
          addDynamicForm_Icons_Edit
          addDynamicForm_Icons_Delete
          addDynamicForm_MaxLength={50}
          addDynamicForm_Label="Project Name"
          addDynamicForm_Placeholder="Project Name"
          onChangeText={(value, label) => {
            setProjectValue(value);
            setProjectLabel(label);
          }}
          onClickButton={handleAddNewProject}
          onDeleteButton={(e) => {
            handleValueChange(e, true);
          }}
        />
        {!textFieldOpen && (
          <Text
            label="Sub-Project Name"
            placeholder="Enter Sub-Project Name"
            value={subProject}
            getValue={(e) => setSubProject(e)}
            getError={(e) => {}}
          />
        )}
      </div>

      <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
        {onEdit ? (
          <Button
            variant="btn-outline-primary"
            className="rounded-[4px] !h-[36px] !uppercase"
            onClick={clearAllData}
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="submit"
            variant="btn-outline-primary"
            className="rounded-[4px] !h-[36px] !uppercase"
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
            className="rounded-[4px] !h-[36px] !uppercase"
            type="submit"
          >
            {onEdit ? "Save" : `Create ${tab === "Permissions" ? "Role" : tab}`}
          </Button>
        )}
      </div>
    </form>
  );
});

export default ProjectContent;
