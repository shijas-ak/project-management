import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { callApi } from "../../services/API";
import { useState } from "react";
import "./styles/ForgotPasword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [status, setStatus] = useState(null);

  const onSubmitEmail = async (data) => {
    try {
      const response = await callApi("post", "forgot-password", data, "");
      console.log("hi",response);
      const userId = response.userId;
      if (response.status === 200) {
        alert("OTP has been successfully sent to your email.Please do check your email and verify the OTP")
        navigate(`/verify-otp/${userId}`);
        setStatus({ type: "success", message: response.message });
      } else {
        setStatus({ type: "error", message: response.message });
      }
    } catch (error) {
      if(error.message === "User not found"){
        alert(error.message)
      }
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitEmail)}>
        <input
          {...register("email", {
            required: "This field is required",
          })}
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
        {status && (
          <p
            className={status.type === "error" ? "text-danger" : "text-success"}
          >
            {status.message}
          </p>
        )}
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
