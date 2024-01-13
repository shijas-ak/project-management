import style from "./page.module.css";

const PmDashboardCard = ({ title, image, value, subvalue, color = "blue" }) => {
  return (
    <div className={`${style.req_card} ${style[color]}`}>
      <img src={image} width={40} height={40} alt="dp" />
      <h6>{title}</h6>
      <h3>
        {value} {subvalue && <sub>{subvalue}</sub>}
      </h3>
    </div>
  );
};

export default PmDashboardCard;
