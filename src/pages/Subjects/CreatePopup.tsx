import { Button, ColorBox, DateBox, NumberBox, Popup, TextBox, ValidationGroup, Validator } from 'devextreme-react';
import { RequiredRule } from 'devextreme-react/validator';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ICreatePopupProps, SubjectForm } from './types';
import DataGrid, { Column, Editing, Grouping, GroupPanel, Paging } from 'devextreme-react/data-grid';
import { CareersService, PensumsService } from '../../services';
import { Subject } from '../../models';
import notify from 'devextreme/ui/notify';
import Utils from '../../utils';

const ColorComponent: React.FC<any> = ({ data }) => {
  return (
    <ColorBox
      value={data.value}
      onValueChanged={({ value }) => {
        data.setValue(value);
      }}
    />
  );
}

const CreatePopup: React.FC<ICreatePopupProps> = ({ userCareer, visible, onHidden, onDataChanged }) => {
  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<ValidationGroup>(null);
  const dataGrid = useRef<DataGrid>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsSelected, setSubjectsSelected] = useState<Subject[]>([]);
  const [model, setModel] = useState<Partial<SubjectForm>>({});

  useEffect(() => {
    if (userCareer && userCareer.id) {
      PensumsService
        .getSubjects(userCareer.pensumId!)
        .then(data => {
          setSubjects(data);
        });
    }
  }, [userCareer]);

  const onSelectionItem = ({ currentSelectedRowKeys, selectedRowsData }: any) => {

    var data = selectedRowsData.find((x: any) => x.id === currentSelectedRowKeys[0]);
    var instance = dataGrid.current?.instance;

    if (instance && currentSelectedRowKeys && data) {
      if (!data.color && !data.teacher) {
        instance.deselectRows(currentSelectedRowKeys);
        notify({ message: 'Debe editar los datos faltantes a esta materia (Color, Profesor)!', width: 'auto' }, "error", 4500);
      } else {
        setSubjectsSelected(selectedRowsData);
      }
    }
  };

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      if (!subjectsSelected || !subjectsSelected.length) {
        notify({ message: 'Debe seleccionar al menos una materia', width: 'auto' }, "error", 4500);
        return;
      }
      CareersService.createPeriod({
        ...model,
        userCareerId: userCareer?.id,
        subjects: subjectsSelected
      }).then((data) => {
        notify({ message: 'Periodo creado correctamente!', width: 'auto' }, "success", 4500);
        popUpEl.current?.instance.toggle(false);
        if(onDataChanged) onDataChanged();
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
    }
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
      title="Elige las asignaturas para un nuevo periodo"
      width={"55%"}
      height="auto"
    >
      <ValidationGroup ref={validationGroupEl}>
        <div className="form-row">
          <div className="form-input" style={{ width: '30%', padding: '0 5px' }}>
            <label>Número del periodo</label>
            <NumberBox
              value={model.number}
              onValueChanged={({ value }) => setModel(prev => ({ ...prev, number: value }))}
            >
              <Validator>
                <RequiredRule message={'El número del periodo es requerido'} />
              </Validator>
            </NumberBox>
          </div>
          <div className="form-input" style={{ width: '70%', padding: '0 5px' }}>
            <label>Nombre del periodo</label>
            <TextBox
              value={model.name}
              onValueChanged={({ value }) => setModel(prev => ({ ...prev, name: value }))}
            >
              <Validator>
                <RequiredRule message={'El nombre del periodo es requerido'} />
              </Validator>
            </TextBox>
          </div>
        </div>
        <div className="form-row" style={{ justifyContent: 'flex-start' }}>
          <div className="form-input" style={{ width: '30%', padding: '0 5px' }}>
            <label>Fecha de inicio</label>
            <DateBox
              displayFormat="EEEE, d MMM, yyyy"
              value={model.initialDate}
              onValueChanged={({ value }) => setModel(prev => ({ ...prev, initialDate: value }))}
            >
              <Validator>
                <RequiredRule message={'La fecha de inicio es requerida'} />
              </Validator>
            </DateBox>
          </div>
          <div className="form-input" style={{ width: '30%', padding: '0 5px' }}>
            <label>Fecha de fin</label>
            <DateBox
              min={new Date()}
              displayFormat="EEEE, d MMM, yyyy"
              value={model.endDate}
              onValueChanged={({ value }) => setModel(prev => ({ ...prev, endDate: value }))}
            >
              <Validator>
                <RequiredRule message={'La fecha de fin es requerida'} />
              </Validator>
            </DateBox>
          </div>
        </div>
        <div style={{ width: '100%', maxWidth: 'fit-content', padding: '10px 5px' }}>
          <DataGrid
            ref={dataGrid}
            dataSource={subjects}
            allowColumnReordering={true}
            showBorders={true}
            width="100%"
            selection={{ mode: 'multiple' }}
            keyExpr="id"
            onSelectionChanged={onSelectionItem}
            onRowUpdated={({ key }) => {
              var instance = dataGrid.current?.instance;
              if (instance) {
                instance.selectRows([key], true);
              }
            }}
          >
            <Editing mode="row" allowUpdating={true} useIcons />
            <GroupPanel visible={true} allowColumnDragging={false} />
            <Grouping autoExpandAll={true} />
            <Paging defaultPageSize={10} />

            <Column dataField="code" caption="Código" dataType="string" allowEditing={false} />
            <Column dataField="name" caption="Nombre" dataType="string" allowEditing={false} />
            <Column dataField="credits" caption="Creditos" dataType="string" allowEditing={false} />
            <Column dataField="prerequisite" caption="Pre-requisitos" dataType="string" allowEditing={false} />
            <Column dataField="corequisite" caption="Co-requisitos" dataType="string" allowEditing={false} />
            <Column dataField="color" caption="Color" dataType="color" editCellComponent={ColorComponent}>
              <RequiredRule />
            </Column>
            <Column dataField="teacher" caption="Profesor" >
              <RequiredRule />
            </Column>
            <Column dataField="period" caption="Periodo" dataType="string" groupIndex={0} />
          </DataGrid>
          <label><b>Nota:</b> Coloca el color y nombre del profesor para luego marca las materias de interes.</label>
        </div>
        <div className="form-input" style={{ textAlign: 'right' }}>
          <Button
            text={'GUARDAR'}
            className="btn-secondary"
            width="auto"
            height="40px"
            stylingMode={'text'}
            type="normal"
            style={{ marginTop: '10px' }}
            onClick={onSubmit}
          />
        </div>
      </ValidationGroup>
    </Popup >
  )
}

export default CreatePopup;