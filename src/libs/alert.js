import Swal from "sweetalert2";

export const alertSuccess = async (message) => {
  return await Swal.fire({
    icon: "success",
    title: "Success",
    html: message, // Using html instead of text to support HTML tags
  });
};

export const alertError = async (message) => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    html: message, // Using html instead of text to support HTML tags
  });
};

export const alertConfirm = async (message) => {
  const result = await Swal.fire({
    icon: "question",
    title: "Are you sure?",
    html: message, // Using html instead of text to support HTML tags
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes",
  });
  return result.isConfirmed;
};