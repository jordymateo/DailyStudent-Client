
import React from "react";
import { Link } from "react-router-dom";
import Images from "../../../../assets/images";
import "./Menu.scss";
export const Menu: React.FC<{disabled: boolean, selectedId: number}> = ({disabled, selectedId}) => {
  return (
    <div className="side-navigation">
      {/* <Link to="/notes"><i className="dx-icon dx-icon-unselectall"></i>Crear nota</Link> */}
      <Link className={disabled? 'disabled' : ''} to={"/assignments/" + selectedId}><i className="dx-icon dx-icon-unselectall"></i>Asignaciones</Link>
      <Link to="/calendar"><img className="calendar-icon" src={Images.Calendar} />Calendario</Link>
    </div>
  );
}