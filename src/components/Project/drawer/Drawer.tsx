// import React, { useRef } from "react";
// import { Close } from "next-ts-lib";
// import "next-ts-lib/dist/index.css";
// import ClientContent from "./content/ClientContent";
// import PermissionsContent from "./content/PermissionsContent";
// import ProjectContent from "./content/ProjectContent";
// import StatusContent, { StatusContenRef } from "./content/StatusContent";
// import UserContent, { UserContentRef } from "./content/UserContent";
// import ProcessContent from "./content/ProcessContent";
// import OrganizationContent, {
//   OrganizationContentRef,
// } from "./content/OrganizationContent";
// import GroupContent, { GroupContentRef } from "./content/GroupContent";

// const Drawer = ({
//   onOpen,
//   onClose,
//   tab,
//   onEdit,
//   userData,
//   orgData,
//   onUserDataFetch,
//   onDataFetch,
//   clientData,
//   groupData,
//   onRefresh,
//   statusData
// }: any) => {
//   const childRef = useRef<UserContentRef>(null);
//   const childRefOrg = useRef<OrganizationContentRef>(null);
//   const childRefGroup = useRef<GroupContentRef>(null);
//   const childRefStatus = useRef<StatusContenRef>(null)
//   const handleClose = () => {
//     onClose();
//     if (childRefOrg.current) {
//       childRefOrg.current.clearOrganizationData();
//     }
//     if (childRefStatus.current) {
//       childRefStatus.current.clearStatusData();
//     }
//     if (childRef.current) {
//       childRef.current.clearAllData();
//     }
//     if (childRefGroup.current) {
//       childRefGroup.current.groupDataValue();
//     }
//     // onRefresh();
//   };

//   return (
//     <div
//       className={`fixed right-0 top-0 z-30 h-screen overflow-y-auto w-[400px] border border-lightSilver bg-pureWhite transform  ${onOpen ? "translate-x-0" : "translate-x-full"
//         } transition-transform duration-300 ease-in-out`}
//     >
//       <div className="flex p-[20px] justify-between items-center bg-whiteSmoke border-b border-lightSilver">
//         <span className="text-pureBlack text-lg font-medium">
//           {onEdit ? "Edit" : "Create"} {tab}
//         </span>
//         <span onClick={handleClose}>
//           <Close variant="medium" />
//         </span>
//       </div>

//       {tab === "Client" && (
//         <ClientContent
//           onOpen={onOpen}
//           tab={tab}
//           onEdit={onEdit}
//           onClose={onClose}
//           clientData={onEdit && clientData}
//           onDataFetch={onDataFetch}
//           onRefresh={onRefresh}
//         />
//       )}
//       {tab === "Permissions" && (
//         <PermissionsContent tab={tab} onEdit={onEdit} onClose={onClose} />
//       )}
//       {tab === "Project" && (
//         <ProjectContent tab={tab} onEdit={onEdit} onClose={onClose} />
//       )}
//       {tab === "Status" && (
//         <StatusContent
//           tab={tab}
//           onClose={onClose}
//           onEdit={onEdit}
//           statusData={onEdit && statusData}
//           onDataFetch={onDataFetch}
//           ref={childRefStatus} />
//       )}
//       {tab === "User" && (
//         <UserContent
//           tab={tab}
//           onEdit={onEdit}
//           onClose={onClose}
//           ref={childRef}
//           userData={onEdit && userData}
//           onUserDataFetch={onUserDataFetch}
//         />
//       )}
//       {tab === "Process" && (
//         <ProcessContent tab={tab} onEdit={onEdit} onClose={onClose} />
//       )}
//       {tab === "Organization" && (
//         <OrganizationContent
//           tab={tab}
//           onEdit={onEdit}
//           onClose={onClose}
//           orgData={orgData}
//           onDataFetch={onDataFetch}
//           ref={childRefOrg}
//         />
//       )}
//       {tab === "Group" && (
//         <GroupContent
//           tab={tab}
//           onEdit={onEdit}
//           onClose={onClose}
//           orgData={orgData}
//           ref={childRefGroup}
//           onDataFetch={onDataFetch}
//           groupData={onEdit && groupData}
//         />
//       )}
//     </div>
//   );
// };

// export default Drawer;
