import { useForm } from "react-hook-form";
import { callApi } from "../../services/API";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/ResetPassword.css";
import { useEffect } from "react";

const ResetPassword = () => {
  const { userId } = useParams();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("userId", userId);
  }, [userId, setValue]);

  const onSubmitPassword = async (data) => {
    try {
      const response = await callApi("post", "reset-password", data, "");

      if (response.status === 200) {
        alert("Password reset successfully")
        navigate("/");
      } else {
        setError("newPassword", {
          type: "manual",
          message: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitPassword)}>
      <input
        {...register("newPassword", {
          required: "This field is required",
        })}
        type="password"
        placeholder="Enter your new password"
      />
      <input type="hidden" {...register("userId", {})} defaultValue={userId} />

      {errors.newPassword && (
        <p className="text-danger">{errors.newPassword.message}</p>
      )}
      <button type="submit">Update Password</button>
    </form>
  );
};

export default ResetPassword;
