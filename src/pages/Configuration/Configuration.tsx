import React, { useRef, useState } from 'react';
import { Button, Popup } from 'devextreme-react';
import { Link } from 'react-router-dom';
import Profile, { ChangePassword } from './Profile';
import Periods from './parts/period/Periods';
import Institutions from './parts/institution/Institution';
import './style.scss';
import AcademicPlan from './parts/academicplan/AcademicPlan';



const Configuration: React.FC<any> = ({ visible, onHidden }) => {
  //const popUpEl = useRef<Popup>(null);
  const [activeOption, setActiveOption] = useState<number>(1);

  return (
    <Popup
      //ref={popUpEl}
      position={{ my: 'center', at: 'center', of: window, offset: { y: 0 } }}
      visible={visible}
      onHiding={onHidden}
      // dragEnabled={false}
      // closeOnOutsideClick={true}
      // showTitle={false}
      title="Configuración"
      shadingColor="rgba(0,0,0, 0.3)"
      width="60%"
      height="75%"
    >
      <div className="configuration-popup">
        <div className="menu-section">
          <div className="first-options">
            <Button
              icon="home"
              text={'Instituciones'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              style={{ marginTop: '10px' }}
              onClick={() => setActiveOption(1)}
              className={activeOption === 1 ? 'menu-item-selected' : ''}
            />
            <Button
              icon="tableproperties"
              text={'Periodos de clase'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              style={{ marginTop: '10px' }}
              onClick={() => setActiveOption(2)}
              className={activeOption === 2 ? 'menu-item-selected' : ''}
            />
            <Button
              icon="checklist"
              text={'Plan académico'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              style={{ marginTop: '10px' }}
              onClick={() => setActiveOption(3)}
              className={activeOption === 3 ? 'menu-item-selected' : ''}
            />
          </div>
          <div className="second-options">
            <Button
              icon="user"
              text={'Mi Perfil'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              style={{ marginTop: '10px' }}
              onClick={() => setActiveOption(4)}
              className={activeOption === 4 ? 'menu-item-selected' : ''}
            />
            <Button
              icon="key"
              text={'Cambiar contraseña'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              style={{ marginTop: '10px' }}
              onClick={() => setActiveOption(5)}
              className={activeOption === 5 ? 'menu-item-selected' : ''}
            />
          </div>
        </div>
        <div className="content-section">
          {activeOption === 1 && (
            <Institutions />
          )}
          {activeOption === 2 && (
            <Periods />
          )}
          {activeOption === 3 && (
            <AcademicPlan />
          )}

          {activeOption === 4 && (
            <Profile />
          )}
          {activeOption === 5 && (
            <ChangePassword />
          )}
        </div>
      </div>
    </Popup >
  );
}



export default Configuration;