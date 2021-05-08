import React, { useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Auth } from '../../services';
import notify from "devextreme/ui/notify";
import { CompareRule, EmailRule, RequiredRule, Validator } from 'devextreme-react/validator';
import { Button, CheckBox, FileUploader, TextBox, ValidationGroup } from 'devextreme-react';
import LoadingButton from '../../components/Buttons/LoadingButton';
import Images from '../../assets/images';
import { Signup } from '../../models';
import { Label, PatternRule, SimpleItem } from 'devextreme-react/form';


const SignUp = () => {

  const history = useHistory();
  const location = useLocation();
  const validationGroupEl = useRef<ValidationGroup>(null);

  const [sending, setSending] = useState<boolean>(false);
  const [accept, setAccept] = useState<boolean>(false);
  const [model, setModel] = useState<Partial<Signup>>({ Image: [] });


  const [textVisible, setTextVisible] = useState<boolean>(true);
  const [isDropZoneActive, setIsDropZoneActive] = useState<boolean>(false);

  const comparePassword = function () {
    return model?.Password;
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      setSending(true);
      const formDataSignUp = new FormData();

      if (model.Image && model.Image.length == 0) {
        notify({ message: "Debe seleccionar una imagen", width: 'auto' }, "error", 4500);
        setSending(false);
        return;
      }

      formDataSignUp.append("Image", model.Image![0]);
      formDataSignUp.append("FirstName", model.FirstName!);
      formDataSignUp.append("LastName", model.LastName!);
      formDataSignUp.append("Email", model.Email!);
      formDataSignUp.append("Password", model.Password!);

      Auth.signUp(formDataSignUp)
        .then((res: any) => {
          const { from }: any = location.state || {
            from: { pathname: "/" }
          };
          setSending(false);
          history.push(from);
          notify({ message: "Registro completado!, se ha enviado un E-mail de confirmación.", width: 'auto' }, "success", 4500);
        })
        .catch((response: any) => {
          setSending(false);
          notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
        });
    }
  }

  var imageContent = null;

  if (model.Image && model.Image.length > 0)
    imageContent = (<img id="dropzone-image" src={URL.createObjectURL(model.Image![0])} alt="" />);

  return (
    <form onSubmit={onSubmit} className="form-md">
      <div className="content-logo">
        <img src={Images.Logo} alt="" />
        <label>Registrarse</label>
      </div>
      <div className="content-form">
        <ValidationGroup ref={validationGroupEl}>
          <div className="form-input" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div id="dropzone-external" className={`flex-box ${isDropZoneActive ? 'dx-theme-accent-as-border-color dropzone-active' : 'dx-theme-border-color'}`}>
              {imageContent}
              {textVisible &&
                <div id="dropzone-text" className="flex-box">
                  <span>Arrastra y suelta</span>
                  <span> …o haz click para buscar la imagen.</span>
                </div>
              }
            </div>
            <FileUploader
              dialogTrigger="#dropzone-external"
              multiple={false}
              visible={false}
              accept="image/*"
              uploadMode="useForm"
              allowCanceling
              dropZone="#file-zone"
              onDropZoneEnter={({ dropZoneElement }) => {
                if (dropZoneElement && dropZoneElement.id === 'dropzone-external') {
                  setIsDropZoneActive(true);
                }
              }}
              onDropZoneLeave={({ dropZoneElement }) => {
                if (dropZoneElement && dropZoneElement.id === 'dropzone-external') {
                  setIsDropZoneActive(false);
                }
              }}
              value={model.Image}
              onValueChanged={({ value }) => {
                if (value) {
                  setModel(prev => ({ ...prev, Image: value! }));
                  setTextVisible(value.length == 0);
                }
              }}
            />
          </div>
          <div className="form-input">
            <TextBox
              onValueChange={(value) => setModel(prev => ({ ...prev, FirstName: value }))}
              placeholder='Nombres' >
              <Validator>
                <RequiredRule message={'Se requiere su nombre'} />
              </Validator>
            </TextBox>
          </div>
          <div className="form-input">
            <TextBox
              onValueChange={(value) => setModel(prev => ({ ...prev, LastName: value }))}
              placeholder='Apellidos'>
              <Validator>
                <RequiredRule message={'Se requiere su apellido'} />
              </Validator>
            </TextBox>
          </div>
          <div className="form-input">
            <TextBox
              onValueChange={(value) => setModel(prev => ({ ...prev, Email: value }))}
              placeholder='Correo electrónico'>
              <Validator>
                <RequiredRule message={'El correo electrónico es requerido'} />
                <EmailRule message="Este correo electronico no es valido" />

              </Validator>
            </TextBox>
          </div>
          <div className="form-input">
            <TextBox
              mode={'password'}
              onValueChange={(value) => setModel(prev => ({ ...prev, Password: value }))}
              placeholder='Contraseña'>
              <Validator>
                <RequiredRule message={'La contraseña es requerida'} />
                <PatternRule
                  message="La contraseña debe poseer al menos 6 caracteres e incluir mayusculas, minusculas y números"
                  pattern={/(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/}
                />
              </Validator>
            </TextBox>
          </div>
          <div className="form-input">
            <TextBox
              mode={'password'}
              placeholder='Confirme contraseña'>
              <Validator>
                <RequiredRule message={'La contraseña es requerida'} />

                <CompareRule message="La contraseña y la confirmacion no son iguales" comparisonType="===" comparisonTarget={comparePassword} />
              </Validator>
            </TextBox>
          </div>
          {/* <FileUploader selectButtonText="Seleccione foto de perfil" onValueChanged={(ev) => setModel(prev => ({ ...prev, Image: ev.value }))} labelText="" accept="image/*" uploadMode="useForm" /> */}

          <div className="form-input" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <CheckBox
              value={accept}
              onValueChange={(value) => setAccept(value)}
              style={{ marginRight: '5px' }}
            />
            <label>He leído y acepto los <a className="label-link" href="https://storage.googleapis.com/profile-ds/Terminos%20y%20condiciones.pdf" target="_blank">términos y condiciones</a></label>
          </div>
          <div className="content-action">
            <Button
              icon={'back'}
              text={'Volver'}
              // width="50%"
              height="40px"
              stylingMode={'text'}
              className="button-dark"
              onClick={() => history.push('/sign_in')}
            />
            <LoadingButton
              disabled={!accept}
              loading={sending}
              text="Registrarse"
              loadingText="Comprobando"
              className="btn-primary"
              width="140px"
              height="40px"
              type={'default'}
              stylingMode={'contained'}
              useSubmitBehavior={true}
            />
          </div>
        </ValidationGroup>
      </div>
    </form>
  );

}

export default SignUp;