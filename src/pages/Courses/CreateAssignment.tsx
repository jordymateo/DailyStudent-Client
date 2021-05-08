import { Button, CheckBox, DateBox, FileUploader, Popup, Switch, TextArea, TextBox, ValidationGroup, Validator } from "devextreme-react";
import { RequiredRule } from "devextreme-react/validator";
import notify from "devextreme/ui/notify";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Images from "../../assets/images";
import { ConfirmationPopup } from "../../components/ConfirmationPopup";
import { Assignment as AssigmentModel } from "../../models";
import { CoursesService } from "../../services";
import Utils from "../../utils";
import { ICreateAssigmentProps } from "./types";

const FileElement: React.FC<any> = ({ file }) => {
  var re = /(?:\.([^.]+))?$/;
  var ext = re.exec(file.name)![1];
  var fileIcon = undefined;
  switch (ext) {
    case 'png':
    case 'jpg':
    case 'jepg':
      fileIcon = Images.File.Image;
      break;
    case 'doc':
    case 'docx':
      fileIcon = Images.File.Document;
      break;
    case 'pdf':
      fileIcon = Images.File.PDF;
      break;
    default:
      fileIcon = Images.File.File;
      break;
  }

  return (
    <div className="file-element">
      <img src={fileIcon} /> <a href={file.path}>{file.name}</a>
    </div>
  );
}

const CreateAssignment: React.FC<ICreateAssigmentProps> = ({ data, visible, onHidden, onDataChanged, courseId }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<ValidationGroup>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [model, setModel] = useState<Partial<AssigmentModel>>({ isIndividual: true, files: [] });

  useEffect(() => {
    if (data) {
      setModel({ ...data, dueDate: new Date(data.dueDate) });
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setModel({ isIndividual: true, files: [] });
    }
  }, [data]);

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      var form = new FormData();
      form.append('title', model.title!);
      form.append('descripcion', model.descripcion!);
      form.append('isIndividual', model.isIndividual!.toString());
      form.append('dueDate', Utils.formatDateToString(model.dueDate!));
      form.append('courseId', courseId!.toString());

      model.files!.forEach(element => {
        form.append('files', element)
      });

      if (data) {
        form.append('id', model.id!.toString());
        CoursesService.updateAssignment(form)
          .then((data) => {
            onDataChanged();
            popUpEl.current?.instance.toggle(false);
            notify({ message: 'Asignación actualizada correctamente!', width: 'auto' }, "success", 4500);
            setModel({ isIndividual: true, files: [] });
            instance.reset();
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      } else {
        CoursesService.insertAssignment(form)
          .then((data) => {
            onDataChanged();
            popUpEl.current?.instance.toggle(false);
            notify({ message: 'Asignación creada correctamente!', width: 'auto' }, "success", 4500);
            setModel({ isIndividual: true, files: [] });
            instance.reset();
          }).catch((response: any) => {
            notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
          });
      }
    }
  };

  const onSubmitComplete = () => {
    const instance = validationGroupEl.current!.instance;
    if (instance) {
      setOpenConfirm(false);
      CoursesService.completeAssignment(data?.id!)
        .then((data) => {
          onDataChanged();
          popUpEl.current?.instance.toggle(false);
          notify({ message: 'Asignación completada correctamente!', width: 'auto' }, "success", 4500);
          setModel({ isIndividual: true, files: [] });
          instance.reset();
        }).catch((response: any) => {
          notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
        });
    }
  }

  const onFilesChanged = ({ value }: any) => {
    setModel(prev => ({ ...prev, files: value }));
  }

  const onChangeEditionMode = () => {
    setIsEditing(false);
  }

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
      title={`${data ? 'Editar' : 'Registrar'} asignación`}
      width={"40%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
        <div className="form-input">
          <label>Título</label>
          <TextBox
            value={model.title}
            onValueChange={(value) => setModel(prev => ({ ...prev, title: value }))}
            readOnly={isEditing}
          >
            <Validator>
              <RequiredRule message={'El título es requerido'} />
            </Validator>
          </TextBox>
        </div>
        <div className="form-row">
          <div className="form-input md-5">
            <label>Fecha limite</label>
            <DateBox
              min={new Date()}
              displayFormat="EEEE, d MMM, yyyy"
              value={model.dueDate}
              onValueChange={(value) => setModel(prev => ({ ...prev, dueDate: value }))}
              readOnly={isEditing}
            >
              <Validator>
                <RequiredRule message={'La fecha limite es requerida'} />
              </Validator>
            </DateBox>
          </div>
          <div className="form-input md-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <CheckBox
              value={model.isIndividual}
              onValueChange={(value) => setModel(prev => ({ ...prev, isIndividual: value }))}
              width="auto"
              text="La actividad es individual"
              readOnly={isEditing}
            />
          </div>
        </div>

        <div className="form-input">
          <label>Descripción</label>
          <TextArea
            height={90}
            value={model.descripcion}
            onValueChange={(value) => setModel(prev => ({ ...prev, descripcion: value }))}
            readOnly={isEditing}
          >
            <Validator>
              <RequiredRule message={'La descripción es requerida'} />
            </Validator>
          </TextArea>
        </div>

        <div className="form-input" id="file-zone">
          {isEditing ? (
            <div className="files-section">
              {model.files?.map(file => (
                <FileElement key={file.name} file={file} />
              ))}
            </div>
          ) : (
              <FileUploader
                multiple={true}
                accept="*"
                uploadMode="useForm"
                allowCanceling
                dropZone="#file-zone"
                value={model.files}
                onValueChanged={onFilesChanged}
                disabled={isEditing}
              />
            )}

        </div>

        {!model.isCompleted && (
          <div className="form-input" style={{ textAlign: 'right' }}>
            {isEditing ? (
              <>
                <Button
                  className="btn-secondary light-orange"
                  text={'EDITAR'}
                  width="auto"
                  height="40px"
                  stylingMode={'text'}
                  type="normal"
                  style={{ marginTop: '10px' }}
                  onClick={onChangeEditionMode}
                />
                <Button
                  className="btn-secondary light-green"
                  text={'COMPLETAR'}
                  width="auto"
                  height="40px"
                  stylingMode={'text'}
                  type="normal"
                  style={{ marginTop: '10px' }}
                  onClick={() => setOpenConfirm(true)}
                />
              </>
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
        )}
      </ValidationGroup>
      <ConfirmationPopup
        okText="Si"
        cancelText="No"
        message={`La asignación actual se completará. ¿Desea continuar?`}
        open={openConfirm}
        onOk={onSubmitComplete}
        onCancel={() => setOpenConfirm(false)}
      />
    </Popup>
  );
}

export default CreateAssignment;