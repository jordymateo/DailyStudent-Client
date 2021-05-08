import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Auth } from '../../services';
import notify from "devextreme/ui/notify";
import { Button } from 'devextreme-react';
import Images from '../../assets/images';


const Verify = () => {

  const history = useHistory();
  const { params }: any = useRouteMatch();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Auth.verify(params['tk'] as string)
      .then((result) => {
        setTimeout(() => {
          if (result)
            setLoading(false);
          else
            history.push('/sign_in');
        }, 1200);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }, []);

  return (
    <form className="form-md">
      <div className="content-logo">
        <img src={Images.Logo} alt="" />
        <label>{loading ? "Validando" : "Validación Completada"}</label>
      </div>
      <div className="content-form">
        <div className="verify-content" style={{ textAlign: 'center' }}>
          {loading ? (
            <div>
              <img style={{ width: '80px', height: '80px' }} src={Images.Loading2} />
            </div>
          ) : (
            <>
              <label>La verificación de su correo eléctronico se realizo de forma exitosa.</label>
              <div style={{ paddingTop: '30px', textAlign: 'center' }}>
                <Button
                  icon={'back'}
                  text={'Volver'}
                  // width="50%"
                  height="40px"
                  stylingMode={'text'}
                  className="button-dark"
                  onClick={() => history.push('/sign_in')}
                />
              </div>
            </>
          )}

        </div>

      </div >
    </form >
  );

}

export default Verify;