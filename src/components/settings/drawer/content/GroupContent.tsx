/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import axios from "axios";
import { Button, Loader, Toast } from "next-ts-lib";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface GroupContentRef {
  groupDataValue: () => void;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Options = {
  label: string;
  value: string;
};

const GroupContent = forwardRef<
  GroupContentRef,
  {
    tab: any;
    onEdit: boolean;
    onClose: () => void;
    onDataFetch: any;
    orgData: any;
    groupData: any;
  }
>(({ tab, orgData, groupData, onEdit, onClose, onDataFetch }, ref) => {
  const [data, setData] = useState<Options[]>([]);
  const [name, setName] = useState<string>("");
  const [nameErr, setNameErr] = useState(false);
  const [nameErrText, setNameErrText] = useState<string>(
    "This field is required."
  );
  const [selectValue, setSelectValue] = useState<any[]>([]);
  const [selectedOptions, setSelectOptions] = useState<Options[]>([]);
  const [selectvalueErr, setSelectValueErr] = useState(false);
  const [selectvalueHasErr, setSelectValueHasErr] = useState(false);
  const [loader, setLoader] = useState(false);
  const token = localStorage.getItem("token");
  const org_token = localStorage.getItem("Org_Token");

  const fetchEditData = async () => {
    if (onEdit) {
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/group/getbyid`,
          { groupId: onEdit || 0 },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: org_token,
            },
          }
        );

        if (response.status === 200) {
          let groupuserIds = response.data.ResponseData.GroupUserIds;

          const filteredOptionsData = data.filter((d) => {
            return groupuserIds.some((id: number) => {
              return id === parseInt(d.value);
            });
          });

          if (response.data.ResponseStatus === "Success") {
            setName(response.data.ResponseData.Name);
            if (!groupuserIds) {
              groupuserIds = null;
            } else {
              setSelectOptions(filteredOptionsData);
              setSelectValue(response.data.ResponseData.GroupUserIds);
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setName("");
      setSelectOptions([]);
      setSelectValue([]);
    }
  };

  useEffect(() => {
    // Call the async function
    fetchEditData();
    // Fetch dropdown data unconditionally
    getDropdownData();

    setNameErr(false);
    setNameErrText("This field is required.");
    setSelectValueErr(false);
    setSelectValueHasErr(false);
  }, [onEdit]);

  // For drop down fetch data in api
  const getDropdownData = async () => {
    try {
      const response = await axios.get(
        `${process.env.api_url}/user/getdropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: org_token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setData(response.data.ResponseData);
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
          Toast.error("Add failed. Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // For Error Handling
  const groupDataValue = async () => {
    const setHasTrue = () => {
      setNameErr(true);
      setSelectValueErr(true);
    };
    const clearData = () => {
      setName("");
      setSelectValue([]);
      setSelectOptions([]);
      setNameErr(false);
      setSelectValueErr(false);
      setNameErrText("This field is required.");
      setSelectValueHasErr(false);
    };
    await setHasTrue();
    await clearData();
  };

  useImperativeHandle(ref, () => ({
    groupDataValue,
  }));

  // For create Group
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    name.trim().length <= 0 && setNameErr(true);
    // const validName = /^[a-zA-Z0-9 ]+$/.test(name);

    // if (!validName) {
    //   setNameErr(true);
    //   return;
    // }
    if (!nameErr && name !== "" && name.trim.length <= 0) {
      setLoader(true);
      try {
        const prams = {
          id: onEdit || 0,
          name: name,
          groupUserIds: selectValue,
        };
        const response = await axios.post(
          `${process.env.pms_api_url}/group/save`,
          prams,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: org_token,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            onDataFetch();
            setLoader(false);
            onClose();
            groupDataValue();
            Toast.success(
              `${onEdit ? "" : "New"} Group ${
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
            Toast.error("Please try again.");
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

  // AddMore data Submit
  const addMoreSubmit = async (e: any) => {
    e.preventDefault();
    name.trim().length <= 0 && setNameErr(true);

    if (!nameErr && name !== "" && name.trim.length <= 0) {
      try {
        const prams = {
          id: onEdit || 0,
          name: name,
          groupUserIds: selectValue,
        };
        const response = await axios.post(
          `${process.env.pms_api_url}/group/save`,
          prams,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: org_token,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            Toast.success(
              `${onEdit ? "" : "New"} Group ${
                onEdit ? "Updated" : "added"
              }  successfully.`
            );
            onDataFetch();
            groupDataValue();
          } else {
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
      setName("");
      setSelectValue([]);
      setSelectOptions([]);
    }
  };

  const handleGroupName = (e: any) => {
    if (e.target.value === "" || e.target.value.trim().length <= 0) {
      setName(e.target.value);
      setNameErr(true);
      setNameErrText("This is required field.");
    } else if (/[^a-zA-Z0-9\s]/.test(e.target.value)) {
      setName(e.target.value);
      setNameErr(true);
      setNameErrText("Special Character is not allowed.");
    } else if (e.target.value.length > 20) {
      setName(e.target.value);
      setNameErr(true);
      setNameErrText("More than 20 Characters are not allowed.");
    } else {
      setName(e.target.value);
      setNameErr(false);
      setNameErrText("This field is required.");
    }
  };

  const handleMultiSelect = (e: React.SyntheticEvent, value: any) => {
    if (value !== undefined) {
      const selectedValue = value.map((v: any) => v.value);
      setSelectOptions(value);
      setSelectValue(selectedValue);
    } else {
      setSelectValue([]);
    }
  };

  return (
    <>
      <div className="flex gap-[20px] flex-col p-[20px]">
        <TextField
          value={name}
          error={nameErr}
          helperText={nameErr && nameErrText}
          required
          id="standard-basic"
          label="Group Name"
          placeholder="Add group name"
          variant="standard"
          onChange={handleGroupName}
        />
        <Autocomplete
          multiple
          limitTags={2}
          id="checkboxes-tags-demo"
          options={data}
          value={selectedOptions}
          getOptionLabel={(option) => option.label}
          getOptionDisabled={(option) => selectValue.includes(option.value)}
          disableCloseOnSelect
          onChange={handleMultiSelect}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selectValue.includes(option.value)}
              />
              {option.label}
            </li>
          )}
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="User"
              placeholder="Please Select..."
              variant="standard"
            />
          )}
        />
      </div>

      <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
        <>
          {onEdit ? (
            <Button
              variant="btn-outline-primary"
              className="rounded-[4px] !h-[36px]"
              onClick={()=> onClose()}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="btn-outline-primary"
              className="rounded-[4px] !h-[36px]"
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
              className="rounded-[4px] !h-[36px]"
              type="submit"
              onClick={handleSubmit}
            >
              {onEdit ? "Save" : "Create Group"}
            </Button>
          )}
        </>
      </div>
    </>
  );
});

export default GroupContent;
