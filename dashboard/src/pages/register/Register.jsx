import React, { useState } from "react";
import styles from "./layout.module.css";
import regStyle from "./register.module.css";
import { Link } from "react-router-dom";
import { callApi } from "../../services/API";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [isMutating, setIsMutating] = useState(false);
  const [showPasswordOne, setShowPasswordOne] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const handleFormSubmit = async (formData) => {
    try {
      setIsMutating(true);

      const dataToSend = {
        firstname: formData.firstName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      };
      const response = await callApi("post", "register", dataToSend, "");

      if (response.status === 200 || response.status === 201) {
        alert("registration is successful, Now please login with your username and password")
        navigate("/");
      } else {
        console.log("Registration failed:", response);
      }
    } catch (error) {
      console.log("error is",error)
      alert(error)
      console.error("Registration error", error);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className={styles.login_bg}>
      <div className={styles.login_left}></div>
      <div className={styles.login_wrapper}>
        <div className={styles.login_right_container}>
          <div className={regStyle.prev_button}>
            <Link to={"/"}>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.5 12H3.67004"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Link>
          </div>
          <div className={styles.login_box}>
            <div className={styles.login_top}>
              <h2>Create an account</h2>
              <p>Enter basic details below to start a new account</p>
            </div>

            <div>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ul className={regStyle.reg_input_wrapper}>
                  <li>
                    <div
                      className={`${styles.login_input} ${regStyle.login_input}`}
                    >
                      <label className={styles.login_label}>Full Name</label>
                      <input
                        {...register("firstName", {
                          required: "This field is required",
                          minLength: {
                            value: 2,
                            message: "Name cannot be a single character.",
                          },
                        })}
                        name="firstName"
                        type="text"
                        className={styles.input_feild}
                        placeholder="Full Name"
                      />
                      {errors.firstName && (
                        <span className="error-msg">
                          *{errors.firstName?.message}
                        </span>
                      )}
                    </div>
                  </li>

                  <li>
                    <div
                      className={`${styles.login_input} ${regStyle.login_input}`}
                    >
                      <label className={styles.login_label}>
                        Email Address*
                      </label>
                      <input
                        {...register("email", {
                          required: "This field is required",
                        })}
                        name="email"
                        type="Email"
                        className={styles.input_feild}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <span className="error-msg">
                          *{errors.email?.message}
                        </span>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className={`${styles.login_input} `}>
                      <label htmlFor="username" className={styles.login_label}>
                        Username
                      </label>
                      <div className={styles.input_relative}>
                        <input
                          {...register("username", {
                            required: "This field is required",
                            minLength: {
                              value: 2,
                              message: "Username cannot be a single character.",
                            },
                          })}
                          name="username"
                          type="text"
                          className={styles.input_feild}
                          placeholder="Username"
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className={`${styles.login_input} `}>
                      <label htmlFor="password" className={styles.login_label}>
                        Password
                      </label>
                      <div className={styles.input_relative}>
                        <input
                          {...register("password", {
                            required: "This field is required",
                          })}
                          name="password"
                          type={showPasswordOne ? "text" : "password"}
                          className={styles.input_feild}
                          placeholder="Password"
                        />
                        <span
                          className={styles.password_toggle}
                          onClick={() => setShowPasswordOne(!showPasswordOne)}
                        >
                          {showPasswordOne ? (
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
                      {errors.password && (
                        <span className="error-msg">
                          *{errors.password?.message}
                        </span>
                      )}
                    </div>
                  </li>
                </ul>

                <div className={styles.login_btn_wrapper}>
                  {!isMutating ? (
                    <button
                      className={`${styles.main_button} main_button`}
                      type="submit"
                    >
                      Continue
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
