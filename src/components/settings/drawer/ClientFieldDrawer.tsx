import axios from "axios";
import { CheckBox, Close, Switch, Toast } from "next-ts-lib";
import React, { useEffect, useState } from "react";

import TaskIcon from "@/assets/icons/TaskIcon";
import { Button } from "@mui/material";

const ClientFieldsDrawer = ({ onOpen, onClose, selectedRowId }: any) => {
  const [fieldsData, setFieldsData] = useState<string[] | any>([]);

  const handleClose = () => {
    onClose();
  };

  const getFieldsByClient = async () => {
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

  const SaveFieldByClient = async (fieldId: number, isChecked: boolean) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
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
          // Toast.success("Success");
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

  useEffect(() => {
    if (selectedRowId && onOpen) {
      getFieldsByClient();
    }
  }, [selectedRowId, onOpen]);

  return (
    <div
      className={`fixed right-0 top-0 z-30 h-screen overflow-y-auto w-[70vw] border border-lightSilver bg-pureWhite transform  ${
        onOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex p-[20px] justify-between items-center bg-whiteSmoke border-b border-lightSilver">
        <span className="text-pureBlack text-lg font-medium">Edit Fields</span>
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
          {fieldsData.map((field: any, index: React.Key | null | undefined) => (
            <div
              key={index}
              className="py-[15px] flex items-center w-64 justify-between"
            >
              <span>{field.DisplayName}</span>
              <span
                onClick={() => {
                  const toggledChecked = !field.IsChecked;
                  SaveFieldByClient(field.FieldId, toggledChecked);
                }}
              >
                <Switch checked={field.IsChecked} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
        <Button
          onClick={handleClose}
          variant="outlined"
          className="rounded-[4px] !h-[36px] !text-secondary"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ClientFieldsDrawer;
