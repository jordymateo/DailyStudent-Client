import React, { useEffect, useRef, useState } from 'react';
import { Button, HtmlEditor, Popup, TextBox, ValidationGroup, Validator } from 'devextreme-react';
import { Note as NoteModel } from "../../models";
import { ICreateNoteProps } from './types';
import { RequiredRule } from 'devextreme-react/validator';
import { Item, MediaResizing, Toolbar } from 'devextreme-react/html-editor';
import { formatDate } from "devextreme/localization";
import { CoursesService } from '../../services';
import notify from 'devextreme/ui/notify';

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
const headerValues = [false, 1, 2, 3, 4, 5];

const CreateNote: React.FC<ICreateNoteProps> = ({ data, visible, onHidden, onDataChanged, courseId }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<ValidationGroup>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [model, setModel] = useState<Partial<NoteModel>>({});

  useEffect(() => {
    if (data) {
      setModel(data);
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setModel({});
    }
  }, [data])

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      if (data) {
        CoursesService.updateNote({
          id: model.id,
          title: model.title!,
          description: model.description!,
          courseId: Number.parseInt(courseId.toString())
        }).then((data) => {
          onDataChanged();
          popUpEl.current?.instance.toggle(false);
          notify({ message: 'Nota actualizada correctamente!', width: 'auto' }, "success", 4500);
          setModel({});
          instance.reset();
        }).catch((response: any) => {
          notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
        });
      } else {
        CoursesService.insertNote({
          title: model.title!,
          description: model.description!,
          courseId: Number.parseInt(courseId.toString())
        }).then((data) => {
          onDataChanged();
          popUpEl.current?.instance.toggle(false);
          notify({ message: 'Nota creada correctamente!', width: 'auto' }, "success", 4500);
          setModel({});
          instance.reset();
        }).catch((response: any) => {
          notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
        });
      }
    }
  };

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
      title={`${data ? 'Editar' : 'Registrar'} nota`}
      width={"60%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
        <div className="form-input">
          <TextBox
            className="creation-note-title"
            value={model.title}
            onValueChange={(value) => setModel(prev => ({ ...prev, title: value }))}
            placeholder="Título de la nota"
            readOnly={isEditing}
          >
            <Validator>
              <RequiredRule message={'El título es requerido'} />
            </Validator>
          </TextBox>
          <div className="creation-note-date">
            <i className="dx-icon dx-icon-clock" />
            <span> Fecha de creación:</span>
            {data ? (
              <span> { formatDate(new Date(data.creationDate!), 'EEEE, d MMM, yyyy')}</span>
            ) : (
                <span> { formatDate(new Date(), 'EEEE, d MMM, yyyy')}</span>
              )}
          </div>
        </div>

        <div className="form-input">
          <HtmlEditor
            height="50vh"
            placeholder="Contenido"

            value={model.description}
            onValueChange={(value) => setModel(prev => ({ ...prev, description: value }))}
            readOnly={isEditing}
          >
            <MediaResizing enabled={true} />
            <Toolbar multiline={true}>
              <Item formatName="undo" />
              <Item formatName="redo" />
              <Item formatName="separator" />
              <Item
                formatName="size"
                formatValues={sizeValues}
              />
              <Item
                formatName="font"
                formatValues={fontValues}
              />
              <Item formatName="separator" />
              <Item formatName="bold" />
              <Item formatName="italic" />
              <Item formatName="strike" />
              <Item formatName="underline" />
              <Item formatName="separator" />
              <Item formatName="alignLeft" />
              <Item formatName="alignCenter" />
              <Item formatName="alignRight" />
              <Item formatName="alignJustify" />
              <Item formatName="separator" />
              <Item formatName="orderedList" />
              <Item formatName="bulletList" />
              <Item formatName="separator" />
              <Item
                formatName="header"
                formatValues={headerValues}
              />
              <Item formatName="separator" />
              <Item formatName="color" />
              <Item formatName="background" />
              <Item formatName="separator" />
              <Item formatName="link" />
              <Item formatName="image" />
              <Item formatName="separator" />
              <Item formatName="clear" />
              <Item formatName="codeBlock" />
              <Item formatName="blockquote" />
              <Item formatName="separator" />
              <Item formatName="insertTable" />
              <Item formatName="deleteTable" />
              <Item formatName="insertRowAbove" />
              <Item formatName="insertRowBelow" />
              <Item formatName="deleteRow" />
              <Item formatName="insertColumnLeft" />
              <Item formatName="insertColumnRight" />
              <Item formatName="deleteColumn" />
            </Toolbar>
          </HtmlEditor>
        </div>
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
      </ValidationGroup>
    </Popup >
  );
}

export default CreateNote;