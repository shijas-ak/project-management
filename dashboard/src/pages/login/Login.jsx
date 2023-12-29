import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { callApi } from "../../services/API";
import styles from "./page.module.css";


export default function Home() {
  const [isMutating, setIsMutating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsMutating(true);
      const response = await callApi("post", "login", data, "");

      if (response.status === 200) {
        console.log("Login successful");
        localStorage.setItem("token", response.token);

        const { role, userId } = response;

        if (role === "PM") {
          navigate(`/pm-dashboard/${userId}`);
        } else if (role === "admin") {
          navigate(`/admin-dashboard/${userId}`);
        } else {
          navigate(`/user-dashboard/${userId}`);
        }
      } else {
        console.error("Login failed:", response.data.message);
        setError("password", {
          type: "manual",
          message: response.data.message,
        });
      }
    } catch (error) {
      alert(error.message)
      console.error(error.message);
      setError("password", { type: "manual", message: error.message });
    } finally {
      setIsMutating(false);
    }
  };
  return (
    <div className={styles.login_bg}>
      <div className={styles.login_left}></div>
      <div className={styles.login_wrapper}>
        <div className={styles.login_right_container}>
          <div className={styles.login_box}>
            <div className={styles.login_top}>
              <h2>Welcome back !</h2>
              <p>Please enter your details to login</p>
            </div>
            <form
              className={styles.login_form}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.login_input}>
                <label htmlFor="username" className={styles.login_label}>
                  Username
                </label>
                <input
                  {...register("username", {
                    required: "This field is required",
                    maxLength: 150,
                    minLength: 2,
                  })}
                  defaultValue=""
                  id="username"
                  name="username"
                  type="username"
                  className="input_feild"
                  placeholder="username"
                  autoComplete="off"
                />
                {errors.username && errors.username.type === "required" && (
                  <p className="text-danger">{errors.username.message}</p>
                )}
                {errors.username && errors.username.type === "maxLength" && (
                  <p className="text-danger">
                    Please shorten this text to 150 characters or less
                  </p>
                )}
                {errors.username && errors.username.type === "minLength" && (
                  <p className="text-danger">
                    Please lengthen this text to 2 characters or more
                  </p>
                )}
              </div>

              <div className={styles.login_input}>
                <label htmlFor="password" className={styles.login_label}>
                  Password
                </label>
                <div className={styles.input_relative}>
                  <input
                    {...register("password", {
                      required: "This field is required",
                      maxLength: 150,
                      minLength: 2,
                    })}
                    defaultValue=""
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="input_feild"
                    placeholder="password"
                    autoComplete="off"
                  />
                  <span
                    className={styles.password_toggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <img
                        src="/images/eye.svg"
                        width={20}
                        height={18}
                        alt="icon"
                      />
                    ) : (
                      <img
                        src="/images/eye-slash.svg"
                        width={20}
                        height={18}
                        alt="icon"
                      />
                    )}
                  </span>
                </div>
                {errors.password && errors.password.type === "required" && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
                {errors.password && errors.password.type === "maxLength" && (
                  <p className="text-danger">
                    Please shorten this text to 150 characters or less
                  </p>
                )}
                {errors.password && errors.password.type === "minLength" && (
                  <p className="text-danger">
                    Please lengthen this text to 2 characters or more
                  </p>
                )}
              </div>

              <div className={styles.login_question}>
                <p>
                  Forgot Password?
                  <Link
                    to="/forgot-password"
                    className={styles.login_qstn_link}
                    tp="#"
                  >
                    &nbsp; Reset password
                  </Link>
                </p>
              </div>

              <div className={styles.login_btn_wrapper}>
                {!isMutating ? (
                  <button
                    className={`${styles.main_button} main_button`}
                    type="submit"
                  >
                    Log in
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${styles.main_button} main_button`}
                  >
                    <div className="dot_pulse"></div>
                  </button>
                )}
              </div>
              <div className={styles.social_login}>
                <p>Or continue with</p>
                <div
                  className={`${styles.social_btn_wrapper} d-flex align-items-center justify-content-center`}
                >
                  <button type="button">
                    <span className="icon-linkedin"></span>Login with Linkedin
                  </button>
                </div>
              </div>
            </form>
            <div className={styles.register_link}>
              <p>
                Don’t have an account ? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
