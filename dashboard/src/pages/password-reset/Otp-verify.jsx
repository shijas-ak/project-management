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
      if (response.status === 200) {
        alert("Your verification is successfull")
        navigate(`/reset-password/${userId}`);
      } else {
        setError("otp", { type: "manual", message: response.message });
      }
    } catch (error) {
      if(error.message === "Invalid OTP"){
        alert(error.message)
      }
      console.error(error);
    }
  };

  const handleResendOTP = async (data) => {
    try {
      const response = await callApi("post", "resend-otp", data, "");
      if (response.status === 200) {
        setResendCount((prevCount) => prevCount + 1);
        alert("OTP has been successfully resent to your email.Please do check your email and verify the OTP")
      } else {
        console.error("Error resending OTP:", response.message);
      }
    } catch (error) {
      alert(error.message)
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
