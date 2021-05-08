import { Button, DropDownBox, FileUploader, Popup, TextBox, ValidationGroup, Validator } from "devextreme-react";
import { RequiredRule, EmailRule, PatternRule, CompareRule } from "devextreme-react/data-grid";
import React, { useRef, useState } from "react";
import Images from "../../../../assets/images";
import LoadingButton from "../../../../components/Buttons/LoadingButton";
import CreatePeriods from "./CreatePeriods";

const CreateCareer: React.FC<any> = ({ visible, onHidden, data = "" }) => {
    //const popUpEl = useRef<Popup>(null);
    const [activeOption, setActiveOption] = useState<number>(0);
    const validationGroupEl = useRef<ValidationGroup>(null);
    const [model, setModel] = useState({});
    const [sending, setSending] = useState<boolean>(false);
    const [periodPopUpVisible, setPeriodPopUpVisible] = useState<boolean>(false);

    if (data != "") {
        alert("HOLA");
    }
    const onSubmit = () => {

        setSending(true);
        setPeriodPopUpVisible(true);
        setSending(false);

    }
    return (
        <div>
            <Popup
                //ref={popUpEl}
                position={{ my: 'center', at: 'center', of: window, offset: { y: 0 } }}
                visible={visible}
                onHiding={onHidden}
                dragEnabled={false}
                // closeOnOutsideClick={true}
                // showTitle={false}
                title="Registrar carrera / curso"
                shadingColor="rgba(0,0,0, 0.3)"
                width="50%"
                height="auto"
            >

                <div>

                    <div className="content-form">
                        <ValidationGroup ref={validationGroupEl}>
                            <div className="dx-fieldset">
                                {/* <div className="dx-fieldset-header">Events and API</div> */}
                                <div className="dx-field">
                                    <DropDownBox
                                        // ref={dropDownBox}
                                        // deferRendering={false}
                                        valueExpr="id"
                                        displayExpr="name"
                                        placeholder="Selecciona una institución / plataforma"
                                        showClearButton={false}
                                        //dataSource={institutions}

                                        contentRender={() =>
                                            <h1></h1>
                                        }
                                    />
                                </div>
                                <div className="dx-field">
                                    <DropDownBox
                                        // ref={dropDownBox}
                                        // deferRendering={false}
                                        valueExpr="id"
                                        displayExpr="name"
                                        placeholder="Selecciona tipo de estudio"
                                        showClearButton={false}
                                        //dataSource={institutions}

                                        contentRender={() =>
                                            <h1></h1>
                                        }
                                    />
                                </div>
                                <div className="dx-field">
                                    <DropDownBox
                                        // ref={dropDownBox}
                                        // deferRendering={false}
                                        valueExpr="id"
                                        displayExpr="name"
                                        placeholder="Selecciona una carrera"
                                        showClearButton={false}
                                        //dataSource={institutions}

                                        contentRender={() =>
                                            <h1></h1>
                                        }
                                    />

                                </div>
                                <div className="dx-field">
                                    <TextBox
                                        placeholder="Nombre de profesor"
                                        hoverStateEnabled={false}
                                    >
                                        <Validator>
                                            {/* <RequiredRule message={'Se requiere su nombre'} /> */}
                                        </Validator>
                                    </TextBox>
                                </div>
                            </div>
                            <div className="content-action">
                                <Button
                                    className="btn-primary"
                                    text={'CONTINUAR'}
                                    width="auto"
                                    height="40px"
                                    // stylingMode={'text'}
                                    type="default"
                                    style={{ marginTop: '10px', float:"right" }}
                                    onClick={onSubmit}
                                    disabled={sending}
                                />
                            </div>
                        </ValidationGroup>
                    </div>
                </div>
            </Popup>

            <CreatePeriods
                visible={periodPopUpVisible}
                onHidden={() => setPeriodPopUpVisible(false)} />
        </div>
    );
}

export default CreateCareer;