import React, { useEffect, useRef, useState } from 'react';
import { Button, ColorBox, FileUploader, Lookup, Popup, SelectBox, TextBox, ValidationGroup, Validator } from 'devextreme-react';
import { Link } from 'react-router-dom';
import { RequiredRule } from 'devextreme-react/validator';
import { DropDownOptions } from 'devextreme-react/lookup';
import { ICreatePopupProps } from './types';
import { Country, Institution } from '../../models';
import { CountriesService, InstitutionsService } from '../../services';
import notify from 'devextreme/ui/notify';


const CreateRequest: React.FC<any> = ({ visible, onHidden }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<any>(null);

  const [model, setModel] = useState<Partial<Institution>>({ logo: [] });
  const [countries, setCountries] = useState<Country[]>();

  useEffect(() => {
    CountriesService.get().then(data => setCountries(data));
  }, []);

  const onSubmit = () => {
    const instance = validationGroupEl.current.instance;

    if (instance.validate().isValid) {
      var form = new FormData();
      form.append('acronym', model.acronym!);
      form.append('name', model.name!);
      form.append('website', model.website!);
      form.append('countryId', model.countryId!.toString());
      form.append('logo', model.logo![0]);
      
      InstitutionsService
        .request(form).then((data) => {
          popUpEl.current?.instance.toggle(false);
          notify({ message: 'Institución solicitada correctamente!', width: 'auto' }, "success", 4500);
          setModel({ logo: [] });
          instance.reset();
        }).catch((response: any) => {
          notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
        });
    }
  };


  return (
    <Popup
      ref={popUpEl}
      position={{ my: 'center', at: 'center', of: window, offset: { y: 0 } }}
      visible={visible}
      onHiding={onHidden}
      dragEnabled={false}
      closeOnOutsideClick={true}
      showTitle={true}
      shadingColor="rgba(0,0,0, 0.3)"
      title="Solicitar creación de institución"
      width={"50%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
        <div className="form-input">
          <label>Acrónimo</label>
          <TextBox
            value={model?.acronym}
            onValueChange={(value) => setModel(prev => ({ ...prev, acronym: value }))}
          >
            <Validator>
              <RequiredRule message={'El acrónimo es requerido'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-input">
          <label>Nombre</label>
          <TextBox
            value={model?.name}
            onValueChange={(value) => setModel(prev => ({ ...prev, name: value }))}
          >
            <Validator>
              <RequiredRule message={'El nombre es requerido'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-input">
          <label>Sitio web</label>
          <TextBox
            value={model?.website}
            onValueChange={(value) => setModel(prev => ({ ...prev, website: value }))}
          >
            <Validator>
              <RequiredRule message={'El sitio web es requerido'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-input">
          <label>País</label>
          <SelectBox
            items={countries}
            placeholder="Elige un país"
            valueExpr="id"
            displayExpr="name"
            value={model.countryId}
            onValueChange={(value) => setModel(prev => ({ ...prev, countryId: value }))}
          >
            <Validator>
              <RequiredRule message={'El país es requerido'} />
            </Validator>
          </SelectBox>
        </div>
        <div className="form-input" id="file-zone">
          <label>Logo</label>
          <FileUploader
            multiple={false}
            accept="image/*"
            uploadMode="useForm"
            allowCanceling
            dropZone="#file-zone"
            value={model?.logo}
            onValueChanged={({ value }) => setModel(prev => ({ ...prev, logo: value ? value : [] }))}
          />
        </div>
        <div className="form-input" style={{ textAlign: 'right' }}>
          <Button
            className="btn-secondary"
            text={'GUARDAR'}
            width="auto"
            height="40px"
            stylingMode={'text'}
            type="normal"
            style={{ marginTop: '10px' }}
            onClick={onSubmit}
          />
        </div>
      </ValidationGroup>
    </Popup>
  );
}

export default CreateRequest;