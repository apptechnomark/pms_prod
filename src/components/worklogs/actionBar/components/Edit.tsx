import EditIcon from "@/assets/icons/worklogs/EditIcon";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import React from "react";

const Edit = ({ onEdit, selectedRowId }: any) => {
  return (
    <div>
      <ColorToolTip title="Edit" arrow>
        <span
          onClick={() => {
            onEdit(selectedRowId);
          }}
        >
          <EditIcon />
        </span>
      </ColorToolTip>
    </div>
  );
};

export default Edit;
