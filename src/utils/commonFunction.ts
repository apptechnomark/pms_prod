/* eslint-disable react-hooks/rules-of-hooks */
// import { useRouter } from "next/navigation";

const hasToken = (router: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    router.push("/settings");
  }
};

const hasNoToken = (router: any) => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
  }
};

const hasPermissionWorklog = (
  tabName: string,
  field: string,
  module: string
) => {
  if (typeof window !== "undefined" && window.localStorage) {
    const role = localStorage.getItem("roleId");
    const roleId = role === null ? 0 : parseInt(role);
    const setting = localStorage.getItem("permission");

    if (setting !== null) {
      const settingArray = JSON.parse(setting);
      const settingPermission = settingArray.filter((set: any) => {
        return set.Name.toLowerCase() === module.toLowerCase();
      });

      if (tabName.trim().length <= 0 && settingPermission.length > 0) {
        const value = settingPermission[0].ActionList.filter(
          (i: any) => i.ActionName.toLowerCase() === field.toLowerCase()
        );
        return value.length > 0 ? value[0].IsChecked : false;
      }

      if (settingPermission.length > 0) {
        const settingTabsPermission = settingPermission[0].Childrens;
        const settingTabsName = settingTabsPermission.map((tab: any) =>
          tab.Name.toLowerCase()
        );

        if (settingTabsName.includes(tabName.toLowerCase())) {
          const value = settingTabsPermission
            .filter(
              (tab: any) => tab.Name.toLowerCase() === tabName.toLowerCase()
            )[0]
            .ActionList.filter(
              (arg1: any) =>
                arg1.ActionName.toLowerCase() === field.toLowerCase()
            );
          return value.length > 0 ? value[0].IsChecked : false;
        }
      }
    }

    if (tabName.toLowerCase() === "organization" && roleId === 1) {
      return true;
    } else {
      return false;
    }
  }
};

export { hasToken, hasNoToken, hasPermissionWorklog };
