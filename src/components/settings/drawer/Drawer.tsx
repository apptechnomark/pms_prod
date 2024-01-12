import React, { useRef, useState } from "react";
import { Close } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import ClientContent, { ClientContentRef } from "./content/ClientContent";
import PermissionsContent, {
  PermissionContentRef,
} from "./content/PermissionsContent";
import ProjectContent, { ProjectContentRef } from "./content/ProjectContent";
import StatusContent, { StatusContenRef } from "./content/StatusContent";
import UserContent, { UserContentRef } from "./content/UserContent";
import ProcessContent, { ProcessContentRef } from "./content/ProcessContent";
import OrganizationContent, {
  OrganizationContentRef,
} from "./content/OrganizationContent";
import GroupContent, { GroupContentRef } from "./content/GroupContent";
import DeleteModal from "@/components/common/DeleteModal";
import axios from "axios";
import OverLay from "@/components/common/OverLay";
import { toast } from "react-toastify";

const Drawer = ({
  onOpen,
  onClose,
  tab,
  onEdit,
  userData,
  orgData,
  onUserDataFetch,
  projectData,
  processData,
  onDataFetch,
  clientData,
  groupData,
  getPermissionDropdown,
  onRefresh,
  statusData,
  getOrgDetailsFunction,
}: any) => {
  const childRef = useRef<UserContentRef>(null);
  const childRefOrg = useRef<OrganizationContentRef>(null);
  const childRefGroup = useRef<GroupContentRef>(null);
  const projectRef = useRef<ProjectContentRef>(null);
  const clientRef = useRef<ClientContentRef>(null);
  const childRefStatus = useRef<StatusContenRef>(null);
  const permissionRef = useRef<PermissionContentRef>(null);
  const [drawerOverlay, setDrawerOverlay] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const childRefProcess = useRef<ProcessContentRef>(null);
  const handleClose = () => {
    onClose();

    if (childRefOrg.current) {
      childRefOrg.current.clearOrganizationData();
    }
    if (childRefStatus.current) {
      childRefStatus.current.clearStatusData();
    }
    if (childRef.current) {
      childRef.current.clearAllData();
    }
    if (childRefGroup.current) {
      childRefGroup.current.groupDataValue();
    }
    if (projectRef.current) {
      projectRef.current.clearAllData();
    }
    if (clientRef.current) {
      clientRef.current.clearAllData();
    }
    if (permissionRef.current) {
      permissionRef.current.clearAllData();
    }
    if (childRefProcess.current) {
      childRefProcess.current.ProcessDataValue();
    }
  };

  const handleDeleteRow = async () => {
    if (selectedRowId) {
      const token = await localStorage.getItem("token");
      const org_Token = await localStorage.getItem("Org_Token");

      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/Project/Delete`,
          {
            ProjectId: selectedRowId,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_Token,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            toast.success("Project has been deleted successfully!");
            onClose();
            onDataFetch();
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
            toast.error("Please try again.");
          } else {
            toast.error(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
      setIsDeleteOpen(false);
    }
  };

  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  const handleChildValuesChange = (
    childValue1: React.SetStateAction<number | null>,
    childValue2: boolean | ((prevState: boolean) => boolean)
  ) => {
    setSelectedRowId(childValue1);
    setIsDeleteOpen(childValue2);
  };

  return (
    <>
      <div
        className={`fixed right-0 top-0 z-30 h-screen overflow-y-auto w-[40%] border border-lightSilver bg-pureWhite transform  ${
          onOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex p-[20px] justify-between items-center bg-whiteSmoke border-b border-lightSilver">
          <span className="text-pureBlack text-lg font-medium">
            {onEdit ? "Edit" : "Create"} {tab === "Permission" ? "Role" : tab}
          </span>
          <span onClick={handleClose}>
            <Close variant="medium" />
          </span>
        </div>

        {tab === "Client" && (
          <ClientContent
            onOpen={onOpen}
            tab={tab}
            onEdit={onEdit}
            onClose={onClose}
            clientData={onEdit && clientData}
            onDataFetch={onDataFetch}
            ref={clientRef}
            onChangeLoader={(e: any) => setDrawerOverlay(e)}
          />
        )}
        {tab === "Permission" && (
          <PermissionsContent
            tab={tab}
            onClose={onClose}
            ref={permissionRef}
            getPermissionDropdown={getPermissionDropdown}
            onChangeLoader={(e: any) => setDrawerOverlay(e)}
          />
        )}
        {tab === "Project" && (
          <ProjectContent
            onOpen={onOpen}
            tab={tab}
            ref={projectRef}
            onEdit={onEdit}
            onDataFetch={onDataFetch}
            onClose={onClose}
            projectData={projectData}
            onValuesChange={handleChildValuesChange}
            onChangeLoader={(e: any) => setDrawerOverlay(e)}
          />
        )}
        {tab === "Status" && (
          <StatusContent
            tab={tab}
            onEdit={onEdit}
            onClose={onClose}
            ref={childRefStatus}
            statusData={onEdit && statusData}
            onDataFetch={onDataFetch}
            onChangeLoader={(e: any) => setDrawerOverlay(e)}
          />
        )}
        {tab === "User" && (
          <UserContent
            onOpen={onOpen}
            tab={tab}
            onEdit={onEdit}
            onClose={onClose}
            ref={childRef}
            userData={onEdit && userData}
            onUserDataFetch={onUserDataFetch}
            onChangeLoader={(e: any) => setDrawerOverlay(e)}
          />
        )}
        {tab === "Process" && (
          <ProcessContent
            onOpen={onOpen}
            tab={tab}
            onEdit={onEdit}
            onClose={onClose}
            ref={childRefProcess}
            onDataFetch={onDataFetch}
            processData={onEdit && processData}
            onChangeLoader={(e: any) => setDrawerOverlay(e)}
          />
        )}
        {tab === "Organization" && (
          <OrganizationContent
            tab={tab}
            onEdit={onEdit}
            onClose={onClose}
            orgData={orgData}
            onDataFetch={onDataFetch}
            ref={childRefOrg}
            getOrgDetailsFunction={getOrgDetailsFunction}
            onChangeLoader={(e: any) => setDrawerOverlay(e)}
          />
        )}
        {tab === "Group" && (
          <GroupContent
            onOpen={onOpen}
            tab={tab}
            onEdit={onEdit}
            onClose={onClose}
            orgData={orgData}
            ref={childRefGroup}
            onDataFetch={onDataFetch}
            groupData={onEdit && groupData}
            onChangeLoader={(e: any) => setDrawerOverlay(e)}
          />
        )}
      </div>

      {isDeleteOpen && tab === "Project" && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={closeModal}
          title="Delete Project"
          actionText="Yes"
          onActionClick={handleDeleteRow}
        >
          <p>
            Are you sure you want to delete Project?
            <br /> If you delete the project, you will permanently lose project
            and project related data.
          </p>
        </DeleteModal>
      )}
      {drawerOverlay ? <OverLay /> : ""}
    </>
  );
};

export default Drawer;
