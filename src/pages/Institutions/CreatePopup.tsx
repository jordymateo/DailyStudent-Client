import React, { useEffect, useRef, useState } from 'react';
import { Button, ColorBox, Lookup, Popup, ResponsiveBox, SelectBox, TextBox, ValidationGroup, Validator } from 'devextreme-react';
import { Link, useHistory } from 'react-router-dom';
import { RequiredRule } from 'devextreme-react/validator';
import { DropDownOptions } from 'devextreme-react/lookup';
import { CareersService, CoursesService, InstitutionsService, PensumsService } from '../../services';
import { Career, Institution, Pensum } from '../../models';
import { ICreatePopupProps, InstitutionForm } from './types';
import { Value } from 'devextreme-react/range-selector';
import notify from 'devextreme/ui/notify';
import { Col, Item, Row, Location } from 'devextreme-react/responsive-box';
import CreateRequest from './CreateRequest';
import { CreateRequest as CareerCreateRequest, PensumCreateRequest } from '../Careers';

const courseType = [{
  id: 'course',
  name: 'Curso'
}, {
  id: 'career',
  name: 'Carrera'
}];

const InstitutionItem: React.FC<Institution> = ({ name, logoPath }) => {
  return (
    <div className="lookup-institution-item">
      <img src={logoPath} /><label>{name}</label>
    </div>
  );
};

const InstitutionField: React.FC<Institution> = (e) => {
  if (!e)
    return null;
  return (
    <div className="lookup-institution-field">
      <img src={e.logoPath} /><label>{e.name}</label>
    </div>
  );
};

const CreatePopup: React.FC<ICreatePopupProps> = ({ visible, onHidden, afterSubmit }) => {
  const history = useHistory();

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<any>(null);
  const [model, setModel] = useState<Partial<InstitutionForm>>({ type: 'course' });
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [pensums, setPensums] = useState<Pensum[]>([]);
  const [pensumPath, setPensumPath] = useState<string>('');

  var [institutionRequestVisible, setInstitutionRequestVisible] = useState<boolean>(false);
  var [careerRequestVisible, setCareerRequestVisible] = useState<boolean>(false);
  var [pensumRequestVisible, setPensumRequestVisible] = useState<boolean>(false);

  useEffect(() => {
    InstitutionsService.get().then((data) => setInstitutions(data));
  }, []);

  const onSubmitCourse = () => {
    const instance = validationGroupEl.current.instance;

    if (instance.validate().isValid) {

      if (model.color?.startsWith('#'))
        model.color = model.color?.substring(1, model.color.length);

      CoursesService.insert({
        name: model.course!,
        color: model.color!,
        courseTypeId: 'course',
        institutionId: model.institutionId!,
        teacherFullName: model.teacher!
      }).then((data) => {
        notify({ message: 'Curso creado correctamente!', width: 'auto' }, "success", 4500);
        popUpEl.current?.instance.toggle(false);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
    }
  };

  const onSubmitCareer = () => {
    const instance = validationGroupEl.current.instance;

    if (instance.validate().isValid) {
      CareersService.create({
        institutionId: model.institutionId!,
        careerId: model.careerId!,
        pensumId: model.pensumId!
      }).then((data) => {
        notify({ message: 'Carrera creada correctamente!', width: 'auto' }, "success", 4500);
        popUpEl.current?.instance.toggle(false);
        afterSubmit(data);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
    }
  };

  const loadCareers = (institutionId: number) => {
    CareersService.getByInstitution(institutionId).then((data) => setCareers(data));
  };

  const onInstitutionChange = (value: number) => {
    setModel(prev => ({ ...prev, institutionId: value }));

    if (model.type === 'career') {
      loadCareers(value);
    }
  };

  const onTypeChange = (value: any) => {
    setModel(prev => ({ ...prev, type: value }));
    if (value === 'career') {
      loadCareers(model.institutionId!);
    }
  }

  const onCareerChange = (value: number) => {
    setModel(prev => ({ ...prev, careerId: value }));
    PensumsService.getByCareer(value).then((data) => setPensums(data));
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
      title="Registrar carrera o curso"
      width={"50%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
        <div className="form-input">
          <label>Institución/Plataforma</label>
          <Lookup
            items={institutions}
            className="lookup-institution"
            placeholder="Selecciona un instituto"
            displayExpr="name"
            valueExpr="id"
            value={model.institutionId}
            searchEnabled={true}
            showCancelButton={false}
            itemRender={InstitutionItem}
            fieldRender={InstitutionField}
            onValueChange={(value) => onInstitutionChange(value)}
          >
            <DropDownOptions showTitle={false} closeOnOutsideClick={true} />
            <Validator >
              <RequiredRule message={'La institución o plataforma es requerida'} />
            </Validator>
          </Lookup>
          <Button
            stylingMode='text'
            onClick={() => {
              setInstitutionRequestVisible(true);
            }}
            className="simple-link"
            text="¿La institución que desea no existe?"
          />
        </div>

        <div className="form-row">
          <div style={{ width: '50%', padding: '2px' }}>
            <div className="form-input">
              <label>Tipo de estudio</label>
              <SelectBox
                items={courseType}
                displayExpr="name"
                valueExpr="id"
                value={model.type}
                onValueChange={(value) => onTypeChange(value)}
              />
            </div>
            {model.type === 'course' ? (
              <div className="form-input">
                <label>Color</label>
                <ColorBox
                  value={model.color}
                  onValueChange={(value) => setModel(prev => ({ ...prev, color: value }))}
                >
                  <Validator>
                    <RequiredRule message={'El color es requerido'} />
                  </Validator>
                </ColorBox>
              </div>
            ) : (
              <>
                <div className="form-input">
                  <label>Carrera</label>
                  <SelectBox
                    items={careers}
                    displayExpr="name"
                    valueExpr="id"
                    placeholder="Selecciona una carrera"
                    value={model.careerId}
                    onValueChange={(value) => onCareerChange(value)}
                  />
                  <Button
                    stylingMode='text'
                    onClick={() => {
                      setCareerRequestVisible(true);
                    }}
                    className="simple-link"
                    text="¿La carrera que desea no existe?"
                  />
                </div>
                <div className="form-input">
                  <label>Pensum</label>
                  <SelectBox
                    items={pensums}
                    displayExpr="name"
                    valueExpr="id"
                    placeholder="Selecciona un pensum"
                    value={model.pensumId}
                    onValueChange={(value) => {
                      setModel(prev => ({ ...prev, pensumId: value }));
                      var pensum = pensums.find(x => x.id === value);
                      setPensumPath(pensum?.path!);
                    }}
                  />
                  <Button
                    stylingMode='text'
                    onClick={() => {
                      setPensumRequestVisible(true);
                    }}
                    className="simple-link"
                    text="¿El pensum que desea no existe?"
                  />
                </div>
              </>
            )}
          </div>
          {model.type === 'career' && (
            <div style={{ width: '50%', padding: '5px 10px', height: '300px' }}>
              <embed src={pensumPath} style={{ width: "-webkit-fill-available", }} height="100%" type="application/pdf" />
            </div>
          )}
        </div>

        {model.type === 'course' && (
          <div className="form-row">
            <div style={{ width: '50%', padding: '2px' }}>
              <div className="form-input">
                <label>Curso</label>
                <TextBox
                  value={model.course}
                  onValueChange={(value) => setModel(prev => ({ ...prev, course: value }))}
                >
                  <Validator>
                    <RequiredRule message={'El nombre del curso es requerido'} />
                  </Validator>
                </TextBox>
              </div>
            </div>
            <div style={{ width: '50%', padding: '2px' }}>
              <div className="form-input">
                <label>Profesor</label>
                <TextBox
                  value={model.teacher}
                  onValueChange={(value) => setModel(prev => ({ ...prev, teacher: value }))}
                >
                  <Validator>
                    <RequiredRule message={'El nombre del profesor es requerido'} />
                  </Validator>
                </TextBox>
              </div>
            </div>
          </div>
        )}

        {model.type === 'course' ? (
          <div className="form-input" style={{ textAlign: 'right' }}>
            <Button
              className="btn-secondary"
              text={'COMPLETAR'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              type="normal"
              style={{ marginTop: '10px' }}
              onClick={onSubmitCourse}
            />
          </div>
        ) : (
          <div className="form-input" style={{ textAlign: 'right' }}>
            <Button
              text={'GUARDAR Y CONTINUAR'}
              className="btn-secondary"
              width="auto"
              height="40px"
              stylingMode={'text'}
              type="normal"
              style={{ marginTop: '10px' }}
              onClick={onSubmitCareer}
            />
          </div>
        )}
      </ValidationGroup>
      <CreateRequest
        visible={institutionRequestVisible}
        onHidden={() => setInstitutionRequestVisible(false)}
      />
      <CareerCreateRequest
        visible={careerRequestVisible}
        onHidden={() => setCareerRequestVisible(false)}
      />
      <PensumCreateRequest
        visible={pensumRequestVisible}
        onHidden={() => setPensumRequestVisible(false)}
      />
    </Popup>
  );
}

export default CreatePopup;