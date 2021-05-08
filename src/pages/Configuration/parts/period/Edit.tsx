import React, { useEffect, useRef, useState } from "react";
import { Button, DateBox, NumberBox, Popup, TextBox, ValidationGroup, Validator } from "devextreme-react";
import notify from "devextreme/ui/notify";
import { RequiredRule } from "devextreme-react/validator";
import { IEditProps } from "./types";
import { Period } from "../../../../models";
import { CareersService } from "../../../../services";

const Edit: React.FC<IEditProps> = ({ data, visible, onHidden, onDataChanged }) => {

  const popUpEl = useRef<Popup>(null);
  const validationGroupEl = useRef<ValidationGroup>(null);
  const [model, setModel] = useState<Partial<Period>>({});

  useEffect(() => setModel(data), [data]);

  const onSubmit = () => {
    const instance = validationGroupEl.current!.instance;

    if (instance.validate().isValid) {
      CareersService.updatePeriod(model)
        .then((data) => {
          onDataChanged();
          popUpEl.current?.instance.toggle(false);
          notify({ message: 'Periodo actualizado correctamente!', width: 'auto' }, "success", 4500);
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
      title={'Editar periodo académico'}
      width={"40%"}
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

export default Edit;