/* eslint-disable react/display-name */
import axios from "axios";
import { Button, Loader, Radio, Text, Toast } from "next-ts-lib";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

export interface PermissionContentRef {
  clearAllData: () => void;
}

const PermissionsContent = forwardRef<
  PermissionContentRef,
  {
    tab: string;
    onClose: () => void;
    getPermissionDropdown: any;
  }
>(({ tab, onClose, getPermissionDropdown }, ref) => {
  const [role, setRole] = useState("");
  const [type, setType] = useState("1");
  const [roleError, setRoleError] = useState(false);
  const [roleHasError, setRoleHasError] = useState(false);
  const [loader, setLoader] = useState(false);

  const clearData = () => {
    setRoleHasError(true);
    setRole("");
    setRoleError(false);
    setRoleHasError(false);
    setType("1");
  };

  const clearAllData = () => {
    onClose();
    clearData();
  };

  useImperativeHandle(ref, () => ({
    clearAllData,
  }));

  const saveRole = async () => {
    setLoader(true);
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/Role/Save`,
        {
          Name: role.trim(),
          type: parseInt(type),
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
          clearAllData();
          getPermissionDropdown();
          setLoader(false);
          Toast.success(`Role created successfully.`);
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
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    role.trim().length <= 0 && setRoleHasError(true);

    if (roleError) {
      saveRole();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-[20px] flex-col p-[20px]">
        <div className="flex -ml-4">
          <Radio
            label="Employee"
            checked={type === "1" ? true : false}
            id="1"
            name="user"
            onChange={(e) => setType(e.target.id)}
          />
          <span className="mr-64">
            <Radio
              label="Client"
              checked={type === "2" ? true : false}
              id="2"
              name="user"
              onChange={(e) => setType(e.target.id)}
            />
          </span>
        </div>

        <Text
          label=" Role"
          placeholder="Enter Role"
          value={role}
          minChar={3}
          maxChar={50}
          validate
          hasError={roleHasError}
          getValue={(e) => setRole(e)}
          getError={(e) => setRoleError(e)}
        />
      </div>

      <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] border-t border-lightSilver">
        <Button
          variant="btn-outline-primary"
          className="rounded-[4px] !h-[36px] !uppercase"
          onClick={clearAllData}
        >
          Cancel
        </Button>
        {loader ? (
          <span className="-mt-1">
            <Loader size="sm" />
          </span>
        ) : (
          <Button
            type="submit"
            variant="btn-primary"
            className="rounded-[4px] !h-[36px] !uppercase"
          >
            Create {tab === "Permissions" ? "Role" : tab}
          </Button>
        )}
      </div>
    </form>
  );
});

export default PermissionsContent;
