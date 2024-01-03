import axios from "axios";
import { Button, Close, Switch } from "next-ts-lib";
import React, { useEffect, useState } from "react";
import TaskIcon from "@/assets/icons/TaskIcon";
import { toast } from "react-toastify";
import OverLay from "@/components/common/OverLay";

const ClientFieldsDrawer = ({ onOpen, onClose, selectedRowId }: any) => {
  const [isLoadingClientFields, setIsLoadingClientFields] = useState(false);
  const [fieldsData, setFieldsData] = useState<string[] | any>([]);

  const handleClose = () => {
    onClose();
  };

  const getFieldsByClient = async () => {
    // const params = ;
    // const url = ;
    // const successCallback = (
    //   ResponseData: any,
    //   error: any,
    //   ResponseStatus: any
    // ) => {
    //   if (ResponseStatus === "Success" && error === false) {
    //   }
    // };
    // callAPI(url, params, successCallback, "POST");
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/client/GetFields`,
        {
          clientId: selectedRowId || 0,
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
          setFieldsData(response.data.ResponseData);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Failed Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const SaveFieldByClient = async (fieldId: number, isChecked: boolean) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      setIsLoadingClientFields(true);
      const response = await axios.post(
        `${process.env.pms_api_url}/client/SaveFields`,
        {
          clientId: selectedRowId || 0,
          FieldId: fieldId,
          IsChecked: isChecked,
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
          getFieldsByClient();
          setIsLoadingClientFields(false);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
          setIsLoadingClientFields(false);
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Failed Please try again.");
        } else {
          toast.error(data);
        }
        setIsLoadingClientFields(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedRowId && onOpen) {
      getFieldsByClient();
    }
  }, [selectedRowId, onOpen]);

  return (
    <>
      <div
        className={`fixed right-0 top-0 z-30 h-screen overflow-y-auto w-[70vw] border border-lightSilver bg-pureWhite transform  ${
          onOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex p-[20px] justify-between items-center bg-whiteSmoke border-b border-lightSilver">
          <span className="text-pureBlack text-lg font-medium">
            Edit Fields
          </span>
          <span onClick={handleClose}>
            <Close variant="medium" />
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-[10px] p-5 border-b border-dashed border-lightSilver">
            <span>
              <TaskIcon />
            </span>
            <span className="text-lg">Task</span>
          </div>

          <div className="py-5 grid grid-cols-3 justify-items-center">
            {fieldsData.map((field: any) => (
              <div
                key={field.FieldId}
                className="py-[15px] flex items-center w-64 justify-between"
              >
                <span>{field.DisplayName}</span>
                <span
                  onClick={() => {
                    const toggledChecked = !field.IsChecked;
                    const isSubProcess = fieldsData
                      .map((i: any) =>
                        i.Type === "SubProcessName" ? i.FieldId : 0
                      )
                      .filter((j: any) => j !== 0);
                    const isProcess =
                      field.Type === "ProcessName" &&
                      field.IsChecked === true &&
                      isSubProcess.length > 0;
                    isProcess && SaveFieldByClient(isSubProcess[0], false);
                    SaveFieldByClient(field.FieldId, toggledChecked);
                  }}
                >
                  <Switch checked={field.IsChecked} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed flex justify-end w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
          <Button
            onClick={handleClose}
            variant="btn-outline-primary"
            className="rounded-[4px] !h-[36px] !text-secondary uppercase"
          >
            Cancel
          </Button>
        </div>
      </div>
      {isLoadingClientFields ? <OverLay /> : ""}
    </>
  );
};

export default ClientFieldsDrawer;
