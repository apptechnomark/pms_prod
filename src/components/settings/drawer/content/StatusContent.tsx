/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import { data } from "autoprefixer";
import axios from "axios";
import { Button, Toast, Text, ColorPicker, Loader } from "next-ts-lib";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface StatusContenRef {
  clearStatusData: () => void;
}
const StatusContent = forwardRef<
  StatusContenRef,
  {
    tab: string;
    onEdit: any;
    statusData: any;
    onClose: () => void;
    onDataFetch: any;
  }
>(({ tab, onClose, onEdit, statusData, onDataFetch }, ref) => {
  const [statusName, setStatusName] = useState("");
  const [type, setType] = useState("");
  const [colorName, setColorName] = useState("");
  const [statusNameHasError, setStatusNameHasError] = useState(false);
  const [statusNameError, setStatusNameError] = useState(false);
  const [isDefualt, setIsDefualt] = useState(false);

  const [loader, setLoader] = useState(false);

  const token = localStorage.getItem("token");
  const org_token = localStorage.getItem("Org_Token");

  const fetchEditData = async () => {
    if (onEdit) {
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/status/GetById`,
          {
            statusId: onEdit || 0,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: org_token,
            },
          }
        );
        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            const data = await response.data.ResponseData;
            setStatusName(data.Name);
            setType(data.Type);
            setIsDefualt(data.IsDefault);
            setColorName(data.ColorCode);
            setStatusNameHasError(true);
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
    } else {
      setStatusName("");
      setColorName("");
    }
  };

  useEffect(() => {
    setStatusNameError(false);
    setStatusNameHasError(false);
    setColorName("#000000");
    setIsDefualt(false);
    setType("");
  }, [onClose]);

  useEffect(() => {
    fetchEditData();
    setStatusNameError(false);
    setStatusNameHasError(false);
    setColorName("");
  }, [onEdit]);

  const clearStatusData = async () => {
    const setHasTrue = () => {
      setStatusNameError(true);
    };
    const clearData = () => {
      setStatusName("");
      setColorName("");
      setStatusNameHasError(false);
    };
    await setHasTrue();
    await clearData();
  };

  useImperativeHandle(ref, () => ({
    clearStatusData,
  }));

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    statusName.trim().length <= 0 && setStatusNameError(true);
    statusName.trim().length > 50 && setStatusNameError(true);
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    if (statusNameHasError) {
      setLoader(true);
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/status/Save`,
          {
            statusId: onEdit || 0,
            name: statusName.trim(),
            Type: type,
            colorCode: colorName.trim(),
          },
          {
            headers: {
              Authorization: `${token}`,
              org_token: Org_Token,
            },
          }
        );
        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            // calling function to get updated data
            onDataFetch();
            clearStatusData();
            setLoader(false);
            onClose();
            Toast.success(
              `${onEdit ? "" : "New"} Status ${
                onEdit ? "Updated" : "added"
              }  successfully.`
            );
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
            Toast.error("Failed Please try again.");
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

  const addMoreSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    statusName.trim().length <= 0 && setStatusNameError(true);
    statusName.trim().length > 50 && setStatusNameError(true);
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    if (statusNameHasError) {
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/status/Save`,
          {
            statusId: onEdit || 0,
            name: statusName,
            type: type,
            colorCode: colorName,
          },
          {
            headers: {
              Authorization: `${token}`,
              org_token: Org_Token,
            },
          }
        );
        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            onDataFetch();
            clearStatusData();
            Toast.success(
              `${onEdit ? "" : "New"} Status ${
                onEdit ? "Updated" : "added"
              }  successfully.`
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
      setStatusNameError(false);
    }
  };

  return (
    <>
      <div className="flex gap-[20px] flex-col p-[20px] min-h-[calc(100vh-145px)]">
        <Text
          label="Status"
          placeholder="Add New Status"
          validate
          noSpecialChar
          value={statusName}
          maxChar={50}
          hasError={statusNameError}
          getValue={(e: any) => setStatusName(e)}
          getError={(e: any) => setStatusNameHasError(e)}
        />
        <Text
          label="Type"
          placeholder="Enter Type"
          value={type}
          getValue={(e: any) => setType(e)}
          getError={() => {}}
          disabled={isDefualt}
        />

        <ColorPicker
          value={colorName}
          onChange={(e) => {
            setColorName(e);
          }}
        />
      </div>
      <div className="flex justify-end right-0  w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver sticky">
        <>
          {onEdit ? (
            <Button
              variant="btn-outline-primary"
              className="rounded-[4px] !h-[36px] !uppercase"
              onClick={onClose}
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
              {onEdit ? "Save" : "Create Status"}
            </Button>
          )}
        </>
      </div>
    </>
  );
});
export default StatusContent;
