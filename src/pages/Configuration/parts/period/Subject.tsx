import React, { useEffect, useRef, useState } from "react";
import { Button, ColorBox, DateBox, NumberBox, Popup, TextBox, ValidationGroup, Validator } from "devextreme-react";
import notify from "devextreme/ui/notify";
import { RequiredRule } from "devextreme-react/validator";
import { ISubjectProps } from "./types";
import { CareersService, CoursesService } from "../../../../services";
import { Course } from "../../../../models";

const Subject: React.FC<ISubjectProps> = ({ periodId, data, visible, onHidden, onDataChanged }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<ValidationGroup>(null);
  const [model, setModel] = useState<Partial<Course>>({});

  useEffect(() => {
    if (data) {
      setModel({ ...data, color: '#' + data.color });
    } else {
      setModel({});
      validationGroupEl.current!.instance.reset();
    }
  }, [data]);

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      if (model.id) {
        CoursesService.update(model as Course)
          .then((data) => {
            onDataChanged();
            popUpEl.current?.instance.toggle(false);
            notify({ message: 'Materia actualizada correctamente!', width: 'auto' }, "success", 4500);
            setModel({});
            instance.reset();
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      } else {
        CareersService.createPeriodSubject({ ...model, academicPeriodId: periodId })
          .then((data) => {
            onDataChanged();
            popUpEl.current?.instance.toggle(false);
            notify({ message: 'Materia creada correctamente!', width: 'auto' }, "success", 4500);
            setModel({});
            instance.reset();
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      }
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
      title={`${model.id ? 'Editar' : 'Crear'} materia`}
      width={"40%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
        <div className="form-input">
          <label>Nombre</label>
          <TextBox
            value={model.name}
            onValueChange={(value) => setModel(prev => ({ ...prev, name: value }))}
          >
            <Validator>
              <RequiredRule message={'El nombre es requerido'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-row">
          <div style={{ width: '40%', padding: '2px' }}>
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
          </div>
          <div style={{ width: '60%', padding: '2px' }}>
            <div className="form-input">
              <label>Profesor</label>
              <TextBox
                value={model.teacherFullName}
                onValueChange={(value) => setModel(prev => ({ ...prev, teacherFullName: value }))}
              >
                <Validator>
                  <RequiredRule message={'El nombre del profesor es requerido'} />
                </Validator>
              </TextBox>
            </div>
          </div>
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

export default Subject;