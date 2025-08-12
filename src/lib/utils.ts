import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { getSession } from "next-auth/react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// check role
export const hasPermission = (
  permission: string,
  listPermissionCheck: string[]
) => {
  if (!Array.isArray(listPermissionCheck)) {
    return false;
  }
  return listPermissionCheck.includes(permission);
};

// check any role
export const hasOneOfPermissions = (
  permissions: string[],
  listPermissionCheck: string[]
) => {
  if (
    !Array.isArray(listPermissionCheck) ||
    !Array.isArray(permissions) ||
    !listPermissionCheck?.length ||
    !permissions?.length
  ) {
    return false;
  }

  return permissions.some((element) => {
    return listPermissionCheck.includes(element);
  });
};

/* normalize text khi tìm kiếm */
export const normalizeText = (input: string) => {
  if (!input) {
    return "";
  }

  return input
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (m) => (m === "đ" ? "d" : "D"));
};

export const exportFile = async (url: string, filename: string) => {
  const session = await getSession();

  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        Authorization: "Bearer " + session?.user?.accessToken,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        if (blob.size === 0) {
          return reject("Đã có lỗi xảy ra!");
        }
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        link.click();

        window.URL.revokeObjectURL(url);
        resolve(true);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export const exportFilePOST = async (
  url: string,
  body: string,
  filename: string
) => {
  const session = await getSession();
  let accessToken = "";
  if (session?.user?.accessToken) {
    accessToken = session?.user.accessToken;
  }

  return new Promise(async (resolve, reject) => {
    const res = await fetch(url, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "POST",
      body,
    });

    if (!res.ok || res.status !== 200) {
      reject(res.statusText);
    } else {
      res
        .blob()
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          link.click();

          window.URL.revokeObjectURL(url);
          resolve(true);
        })
        .catch((err) => {
          reject(err.message);
        });
    }
  });
};

export function formatUserLocalTime(timestamp: string | number | Date) {
  const date = new Date(timestamp);

  return format(date, "dd-MM-yyyy HH:mm:ss");
}
