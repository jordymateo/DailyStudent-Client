import React, { useState } from "react";
import { DropDownButton } from "devextreme-react";
import Button from "devextreme-react/button";
import { useHistory } from "react-router-dom";
import Images from "../../../../assets/images";
import { Auth } from "../../../../services";
import "./UserOption.scss";
import { Configuration } from "../../../../pages/Configuration";

export const UserOption: React.FC = () => {
  const history = useHistory();
  const [profilePopUpVisible, setProfilePopUpVisible] = useState<boolean>(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState<boolean>(false);

  return (
    <div className="user-option">
      <div className="user-menu-options">
        <div className="menu-item">
          <img src={Auth.userContext.profileImage || Images.UserAvatar} />
          <label>{Auth.userContext.name + " " + Auth.userContext.lastName}</label>

        </div>
        <DropDownButton
          icon="preferences"
          className="menu-item"
          width="auto"
          height="auto"
          dropDownOptions={{ width: 230 }}
          items={[{
            id: 1,
            name: 'Configuración',
            icon: 'user',
            onClick: () => {
              setProfilePopUpVisible(true);
              setFirstTimeLoad(true);
            }
          }, {
            id: 2,
            name: 'Cerrar sesión',
            icon: 'export',
            onClick: () => {
              Auth.signOut();
              history.push('/sign_in');
            }
          }]}
          displayExpr={"name"}
          useSelectMode={false}
          showArrowIcon={false}
          stylingMode="text"
        />
        {firstTimeLoad && (
          <Configuration
            visible={profilePopUpVisible}
            onHidden={() => setProfilePopUpVisible(false)}
          />
        )}

      </div>
    </div>
  );
}