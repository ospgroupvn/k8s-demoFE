import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PureComponent } from "react";
import ReactDiffViewer from "react-diff-viewer";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  idOfRecord: string;
  setIdOfRecord: React.Dispatch<React.SetStateAction<string>>;
}

const oldCode = `
import { ClassValue, clsx } from "clsx";
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

`;
const newCode = `
import { clsx, type ClassValue } from "clsx";
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

`;

const neo_oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')
 
if(a > 10) {
  console.log('bar')
}
 
console.log('done')
`;
const neo_newCode = `
const a = 10
const boo = 10
 
if(a === 10) {
  console.log('bar')
}
`;

// const CustomGutter = ({ side, lineNumber, inHoverState, ...rest }: any) => (
//   <td {...rest} className="diff-gutter">
//     {/* Giữ số dòng nhưng KHÔNG hiển thị -/+ */}
//     <span></span>
//   </td>
// );

class Diff extends PureComponent {
  render = () => {
    return (
      <ReactDiffViewer
        // oldValue={neo_oldCode}
        // newValue={neo_newCode}
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
        disableWordDiff={true}
        hideLineNumbers={true}
        extraLinesSurroundingDiff={10000000}
        leftTitle="Bản ghi cũ"
        rightTitle="Bản ghi mới"
        styles={{
          diffRemoved: {
            "& .marker": {
              display: "none",
            },
            // Tùy chỉnh thêm
            // backgroundColor: "#ffebee80",
          },
          diffAdded: {
            "& .marker": {
              display: "none",
            },
            // backgroundColor: "#e8f5e980",
          },
          variables: {
            light: {
              diffViewerBackground: "#fff",
              addedBackground: "#ffeef0",
              removedBackground: "#ffeef0",
              // ...Xem full tại :cite[1]
            },
            dark: {
              diffViewerBackground: "yellow",
              addedBackground: "yellow",
              // ...
            },
          },
          //   marker: {
          //     display: "none",
          //   },
          splitView: {
            border: "1px solid gray",
          },
          titleBlock: {
            border: "1px solid gray",
            fontWeight: "bold",
            position: "sticky",
          },
          content: {
            "&:nth-of-type(2)": {
              borderRight: "1px solid gray",
              width: "50%",
            },
            "&:nth-of-type(3)": {
              borderLeft: "1px solid gray",
            },
            "&:nth-of-type(4)": {
              width: "50%",
            },
          },
        }}
        // renderGutter={CustomGutter}
      />
    );
  };
}

const DetailChangeHistorySystemLogModal = ({
  open,
  setOpen,
  setIdOfRecord,
  idOfRecord,
}: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        setIdOfRecord("");
      }}
    >
      <DialogContent className="min-w-[1000px] md:max-w-[calc(100vw-200px)] max-h-[calc(100vh-100px)] min-h-[400px] z-50 flex flex-col pb-4 max-sm:max-w-full max-sm:min-w-0">
        <DialogHeader className="border-b border-b-[#EBEBF0] pb-4 -mx-6 px-6 max-sm:-mx-2 max-sm:px-2">
          <DialogTitle className="font-bold">
            CHI TIẾT THAY ĐỔI BẢN GHI LOG LỊCH SỬ
            {/* {idOfRecord} */}
          </DialogTitle>

          <DialogDescription>
            <VisuallyHidden>
              Chi tiết thay đổi bản ghi log lịch sử
            </VisuallyHidden>
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-scroll max-h-[100%]">
          <Diff />
        </div>

        <DialogFooter className="flex items-center max-sm:flex-row gap-1">
          <Button
            type="button"
            className="border border-[#C3ECF5] bg-white text-default-blue hover:bg-[#C3ECF5]"
            onClick={() => setOpen(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailChangeHistorySystemLogModal;
