import React, { useState ,useEffect} from "react";
import { useForm } from "react-hook-form";
import { useNavigate,useParams } from "react-router-dom";
import { callApi } from "../../services/API";
import "./styles/Otp-verify.css";

const VerifyOtp = () => {
  const {userId} = useParams()
  const navigate = useNavigate();
  const [resendCount, setResendCount] = useState(0);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("userId", userId);
  }, [userId, setValue]);


  const onSubmitOTP = async (data) => {
    try {
      const response = await callApi("post", "verify-otp", data, "");
      console.log("otp response", response);

      if (response.status === 200) {
        navigate(`/reset-password/${userId}`);
      } else {
        setError("otp", { type: "manual", message: response.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleResendOTP = async (data) => {
    try {
      const response = await callApi("post", "resend-otp", data, "");

      if (response.status === 200) {
        setResendCount((prevCount) => prevCount + 1);
        alert("OTP resent successfully")
        console.log("OTP resent successfully");
      } else {
        console.error("Error resending OTP:", response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitOTP)}>
        <input
          {...register("otp", {
            required: "This field is required",
          })}
          placeholder="Enter the OTP sent to your email"
        />
        <input type="hidden" {...register("userId", {})} defaultValue={userId}/>

        {errors.otp && <p className="text-danger">{errors.otp.message}</p>}
        <button type="submit">Verify OTP</button>
      </form>

      <div className="resend-container">
        <p>
          Didn't receive OTP?{" "}
          <button onClick={handleResendOTP} disabled={resendCount >= 3}>
            Resend OTP
          </button>
          {resendCount >= 3 && <span>Exceeded resend attempts</span>}
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
