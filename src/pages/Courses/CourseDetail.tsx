import { Button, CheckBox, ColorBox, DateBox, FileUploader, Popup, Switch, TextArea, TextBox, ValidationGroup, Validator } from "devextreme-react";
import { RequiredRule } from "devextreme-react/validator";
import notify from "devextreme/ui/notify";
import React, { useEffect, useRef, useState } from "react";
import { ConfirmationPopup } from "../../components/ConfirmationPopup";
import { Assignment as AssigmentModel, Course } from "../../models";
import { CoursesService } from "../../services";
import { ICourseDetailProps, ICreateAssigmentProps } from "./types";

const CourseDetail: React.FC<ICourseDetailProps> = ({ data, visible, onHidden, onDataChanged }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<ValidationGroup>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [model, setModel] = useState<Partial<Course>>({});

  useEffect(() => {
    if (data) {
      setModel({...data, color: '#' + data.color});
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setModel({});
    }
  }, [data]);

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      CoursesService.update(model as Course)
        .then((data) => {
          onDataChanged();
          popUpEl.current?.instance.toggle(false);
          notify({ message: 'Curso actualizado correctamente!', width: 'auto' }, "success", 4500);
          setModel({});
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
      title={'Detalle del curso'}
      width={"40%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
        <div className="form-input">
          <label>Nombre</label>
          <TextBox
            value={model.name}
            onValueChange={(value) => setModel(prev => ({ ...prev, name: value }))}
            readOnly={isEditing}
          >
            <Validator>
              <RequiredRule message={'El nombre es requerido'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-row">
          <div className="form-input md-5">
            <label>Profesor</label>
            <TextBox
              value={model.teacherFullName}
              onValueChange={(value) => setModel(prev => ({ ...prev, teacherFullName: value }))}
              readOnly={isEditing}
            >
              <Validator>
                <RequiredRule message={'El nombre es requerido'} />
              </Validator>
            </TextBox>
          </div>
        </div>

        <div className="form-input ">
            <label>Color</label>
            <ColorBox
              value={model.color}
              onValueChange={(value) => setModel(prev => ({ ...prev, color: value }))}
              readOnly={isEditing}
            >
              <Validator>
                <RequiredRule message={'El color es requerido'} />
              </Validator>
            </ColorBox>
          </div>
        <div className="form-input" style={{ textAlign: 'right' }}>
          {isEditing ? (
            <Button
              className="btn-secondary light-orange"
              text={'EDITAR'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              type="normal"
              style={{ marginTop: '10px' }}
              onClick={() => setIsEditing(false)}
            />
          ) : (
            <Button
              className="btn-secondary"
              text={'GUARDAR'}
              width="auto"
              height="40px"
              stylingMode={'text'}
              type="normal"
              style={{ marginTop: '10px' }}
              onClick={onSubmit}
              disabled={isEditing}
            />
          )}
        </div>
      </ValidationGroup>
    </Popup>
  );
}

export default CourseDetail;