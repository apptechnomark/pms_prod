/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import axios from "axios";
import { Button, Text } from "next-ts-lib";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { toast } from "react-toastify";

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
    onOpen: boolean;
    onClose: () => void;
    onDataFetch: any;
    orgData: any;
    groupData: any;
    onChangeLoader: any;
  }
>(
  (
    {
      tab,
      orgData,
      groupData,
      onEdit,
      onOpen,
      onClose,
      onDataFetch,
      onChangeLoader,
    },
    ref
  ) => {
    const [data, setData] = useState<Options[]>([]);
    const [groupName, setGroupName] = useState("");
    const [groupNameHasError, setGroupNameHasError] = useState(false);
    const [groupNameError, setGroupNameError] = useState(false);
    const [selectValue, setSelectValue] = useState<any[]>([]);
    const [selectedOptions, setSelectOptions] = useState<Options[]>([]);
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
              setGroupName(response.data.ResponseData.Name);
              setGroupNameError(true);
              if (!groupuserIds) {
                groupuserIds = null;
              } else {
                setSelectOptions(filteredOptionsData);
                setSelectValue(response.data.ResponseData.GroupUserIds);
              }
            } else {
              const data = response.data.Message;
              if (data === null) {
                toast.error("Please try again later.");
              } else {
                toast.error(data);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setGroupName("");
        setGroupNameError(false);
        setGroupNameHasError(false);
        setSelectOptions([]);
        setSelectValue([]);
      }
    };

    useEffect(() => {
      fetchEditData();
      onOpen && getDropdownData();
      setGroupNameError(false);
      setGroupNameHasError(false);
    }, [onEdit, onOpen]);

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
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Add failed. Please try again.");
          } else {
            toast.error(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const groupDataValue = async () => {
      const setHasTrue = () => {
        setGroupNameError(true);
        setGroupNameHasError(true);
      };
      const clearData = () => {
        setGroupName("");
        setSelectValue([]);
        setSelectOptions([]);
        setGroupNameError(false);
        setGroupNameHasError(false);
      };
      await setHasTrue();
      await clearData();
    };

    useImperativeHandle(ref, () => ({
      groupDataValue,
    }));

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      groupName.trim().length <= 0 && setGroupNameHasError(true);
      if (groupNameError && groupName !== "" && groupName.trim.length <= 0) {
        onChangeLoader(true);
        try {
          const prams = {
            id: onEdit || 0,
            name: groupName.trim(),
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
              onChangeLoader(false);
              onClose();
              groupDataValue();
              toast.success(
                `${onEdit ? "" : "New"} Group ${
                  onEdit ? "Updated" : "added"
                }  successfully.`
              );
            } else {
              onChangeLoader(false);
              const data = response.data.Message;
              if (data === null) {
                toast.error("Please try again later.");
              } else {
                toast.error(data);
              }
            }
          } else {
            onChangeLoader(false);
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again.");
            } else {
              toast.error(data);
            }
          }
        } catch (error) {
          onChangeLoader(false);
          console.error(error);
        }
      }
    };

    const addMoreSubmit = async (e: any) => {
      e.preventDefault();
      groupName.trim().length <= 0 && setGroupNameHasError(true);

      if (groupNameError && groupName !== "" && groupName.trim.length <= 0) {
        try {
          const prams = {
            id: onEdit || 0,
            name: groupName,
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
              toast.success(
                `${onEdit ? "" : "New"} Group ${
                  onEdit ? "Updated" : "added"
                }  successfully.`
              );
              onDataFetch();
              groupDataValue();
            } else {
              const data = response.data.Message;
              if (data === null) {
                toast.error("Please try again later.");
              } else {
                toast.error(data);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
        setGroupName("");
        setGroupNameError(false);
        setGroupNameHasError(false);
        setSelectValue([]);
        setSelectOptions([]);
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
          <Text
            label="Group Name"
            placeholder="Add group name"
            validate
            value={groupName}
            maxChar={20}
            hasError={groupNameHasError}
            getValue={(e) => setGroupName(e)}
            getError={(e) => setGroupNameError(e)}
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
            style={{ width: 640 }}
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
                className="rounded-[4px] !h-[36px] !uppercase"
                onClick={() => onClose()}
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
            <Button
              variant="btn-primary"
              className="rounded-[4px] !h-[36px] !uppercase"
              type="submit"
              onClick={handleSubmit}
            >
              {onEdit ? "Save" : "Create Group"}
            </Button>
          </>
        </div>
      </>
    );
  }
);

export default GroupContent;
