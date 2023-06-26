
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const errorToast = async (toastMessage) => {
  toast.error(toastMessage);
}
export const infoToast = async (toastMessage) => {
  toast.info(toastMessage);
}
export const successToast = async (toastMessage) => {
  toast.success(toastMessage);
}
export const warnToast = async (toastMessage) => {
  toast.warn(toastMessage);
}
export const defaultToast = async (toastMessage) => {
  toast(toastMessage);
}