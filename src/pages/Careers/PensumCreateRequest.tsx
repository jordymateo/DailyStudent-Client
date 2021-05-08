import React, { useEffect, useRef, useState } from 'react';
import { PensumForm } from './types';
import { Button, DataGrid, DropDownBox, FileUploader, NumberBox, Popup, TextBox, ValidationGroup, Validator } from "devextreme-react";
import { RequiredRule } from 'devextreme-react/validator';
import { CareersService, PensumsService } from '../../services';
import { Career } from '../../models';
import notify from 'devextreme/ui/notify';
import { FilterRow, Paging, Scrolling, Selection } from 'devextreme-react/data-grid';


const PensumCreateRequest: React.FC<any> = ({ visible, onHidden }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<any>(null);
  const [model, setModel] = useState<Partial<PensumForm>>({ pensum: [] });
  const [careers, setCareers] = useState<Career[]>();

  useEffect(() => {
    CareersService.getAll().then(data => setCareers(data));
  }, []);

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      var form = new FormData();
      form.append('name', model.name!);
      form.append('careerId', model.careerId!.id.toString());
      form.append('creditLimitPerPeriod', model.creditLimitPerPeriod!.toString());

      if (model.pensum && model.pensum.length)
        form.append('pensum', model.pensum![0]);

      PensumsService
        .request(form).then((data) => {
          popUpEl.current?.instance.toggle(false);
          notify({ message: 'Pensum solicitado correctamente!', width: 'auto' }, "success", 4500);
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
      title={'Solicitar pensum'}
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
          <label>Carrera</label>
          <DropDownBox
            valueExpr="id"
            deferRendering={false}
            displayExpr="name"
            placeholder="Elige una carrera"
            showClearButton={true}
            dataSource={careers}
            value={model.careerId?.id}
            onValueChanged={({ value }: any) => setModel(prev => ({ ...prev, career: value }))}
            contentRender={() => (
              <DataGrid
                dataSource={careers}
                columns={[{
                  dataField: "institutionName",
                  caption: "Institución"
                }, {
                  dataField: "name",
                  caption: "Nombre"
                }]}
                hoverStateEnabled={true}
                selectedRowKeys={model.careerId}
                onSelectionChanged={({ selectedRowKeys }) => setModel(prev => ({ ...prev, careerId: selectedRowKeys![0] }))}
                height="100%">
                <Selection mode="single" />
                <Scrolling mode="infinite" />
                <Paging enabled={true} pageSize={10} />
                <FilterRow visible={true} />
              </DataGrid>
            )}
          >

            <Validator>
              <RequiredRule message={'La carrera es requerida'} />
            </Validator>
          </DropDownBox>
        </div>
        <div className="form-input">
          <label>Limite de creditos por periodo</label>
          <NumberBox
            value={model?.creditLimitPerPeriod}
            onValueChange={(value) => setModel(prev => ({ ...prev, creditLimitPerPeriod: value }))}
          >
            <Validator>
              <RequiredRule message={'El limite de creditos por periodo es requerido'} />
            </Validator>
          </NumberBox>
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

export default PensumCreateRequest;