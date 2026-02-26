import Swal from "sweetalert2";

export const notify = {
  success: (title: string, text?: string) =>
    Swal.fire(title, text || "", "success"),
  error: (title: string, text?: string) =>
    Swal.fire(title, text || "", "error"),
  warn: (title: string, text?: string) =>
    Swal.fire(title, text || "", "warning"),
  confirm: async (title: string, text?: string) =>
    Swal.fire({ title, text, icon: "warning", showCancelButton: true }),
};
