import React, { useEffect, useRef, useState } from 'react';
import { Button, FileUploader, Popup, SelectBox, TextBox, ValidationGroup, Validator } from "devextreme-react";
import { RequiredRule } from 'devextreme-react/validator';
import { CareersService, InstitutionsService } from '../../services';
import { Institution } from '../../models';
import notify from 'devextreme/ui/notify';
import { CareerForm } from './types';


const CreateCareer: React.FC<any> = ({ visible, onHidden }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<any>(null);
  const [model, setModel] = useState<Partial<CareerForm>>({ pensum: [] });
  const [institutions, setInstitutions] = useState<Institution[]>();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    InstitutionsService.getAll().then(data => setInstitutions(data));
  }, []);


  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      var form = new FormData();
      form.append('name', model.name!);
      form.append('institutionId', model.institutionId!.toString());
      form.append('pensum', model.pensum![0]);

      CareersService
        .request(form).then((data) => {
          popUpEl.current?.instance.toggle(false);
          notify({ message: 'Carrera solicitada correctamente!', width: 'auto' }, "success", 4500);
          setModel({ pensum: [] });
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
      showTitle={true}
      shadingColor="rgba(0,0,0, 0.3)"
      title={'Solicitar carrera'}
      width={"40%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
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
          <label>Institución académica</label>
          <SelectBox
            items={institutions}
            placeholder="Elige una institución"
            valueExpr="id"
            displayExpr="name"
            value={model.institutionId}
            onValueChange={(value) => setModel(prev => ({ ...prev, institutionId: value }))}
          >
            <Validator>
              <RequiredRule message={'La institución es requerida'} />
            </Validator>
          </SelectBox>
        </div>
        <div className="form-input" id="file-zone">
          <label>Pensum</label>
          <FileUploader
            multiple={false}
            accept="application/pdf"
            uploadMode="useForm"
            allowCanceling
            dropZone="#file-zone"
            value={model?.pensum}
            disabled={isEditing}
            onValueChanged={({ value }) => setModel(prev => ({ ...prev, pensum: value ? value : [] }))}
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

export default CreateCareer;