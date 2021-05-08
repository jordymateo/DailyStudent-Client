import { Button } from 'devextreme-react';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Images from '../../assets/images';
import UserInstitutionsContext from '../../context/UserInstitutionsContext';
import { UserCareer } from '../../models';
import { CreatePopup } from '../Institutions';
import { CreatePopup as CreateSubjectsPopup } from '../Subjects';


const Home = () => {
  const history = useHistory();
  var [createVisible, setCreateVisible] = useState<boolean>(false);
  var [userCareer, setUserCareer] = useState<UserCareer>({} as UserCareer);
  var [createSubjectsVisible, setCreateSubjectsVisible] = useState<boolean>(false);

  const [,, isEmpty] = useContext(UserInstitutionsContext);

  if (!isEmpty)
    return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <img src={Images.Logo} />
      <label>¿No tienes configurados tus estudios? Haz click en el botón para iniciar</label>
      <Button
        text={'¡Empezar!'}
        width="100px"
        height="40px"
        stylingMode={'contained'}
        type="success"
        className="button-dark btn btn-primary"
        style={{ marginTop: '10px' }}
        onClick={() => setCreateVisible(true)}
      />
      <CreatePopup
        visible={createVisible}
        onHidden={() => setCreateVisible(false)}
        afterSubmit={(data) => {
          setCreateSubjectsVisible(true);
          setUserCareer(data);
        }}
      />
      <CreateSubjectsPopup
        userCareer={userCareer}
        visible={createSubjectsVisible}
        onHidden={() => setCreateSubjectsVisible(false)}
      />
    </div>
  );
};

export default Home;