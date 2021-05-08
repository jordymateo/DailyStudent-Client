import { Button, DropDownBox, FileUploader, Popup, TextBox, ValidationGroup, Validator } from "devextreme-react";
import { RequiredRule, EmailRule, PatternRule, CompareRule } from "devextreme-react/data-grid";
import React, { useRef, useState } from "react";
import Images from "../../../../assets/images";
import LoadingButton from "../../../../components/Buttons/LoadingButton";

const CreatePeriods: React.FC<any> = ({ visible, onHidden, data = "" }) => {
    //const popUpEl = useRef<Popup>(null);
    const [activeOption, setActiveOption] = useState<number>(0);
    const validationGroupEl = useRef<ValidationGroup>(null);
    const [model, setModel] = useState({});
    const [sending, setSending] = useState<boolean>(false);
    if (data != "") {
        alert("HOLA");
    }
    const onSubmit = () => {

    }
    return (
        <Popup
            //ref={popUpEl}
            position={{ my: 'center', at: 'center', of: window, offset: { y: 0 } }}
            visible={visible}
            onHiding={onHidden}
            dragEnabled={false}
            // closeOnOutsideClick={true}
            // showTitle={false}
            title="Agregar nuevo periodo"
            shadingColor="rgba(0,0,0, 0.3)"
            width="50%"
            height="50%"
        > <div className="dx-fieldset">
                <div className="form-input">
                    {/* <label>Título</label> */}
                    <TextBox
                        placeholder="Nombre del periodo"
                    >
                        <Validator>
                            <RequiredRule message={'El título es requerido'} />
                        </Validator>
                    </TextBox>
                </div>
            </div>
            <div className="dx-fieldset-header">ASIGNATURAS - PENSUM 2020</div>
            <small>Marca las asignaturas que deseas escoger para este nuevo periodo:</small>

        </Popup>
    );
}

export default CreatePeriods;