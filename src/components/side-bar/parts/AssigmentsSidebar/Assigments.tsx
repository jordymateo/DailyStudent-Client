import React from "react";
import { IAssignmentsProps } from "../../types";
import { AssigmentItem } from "./AssigmentItem";
import "./Assigments.scss";


export const Assigments: React.FC<IAssignmentsProps> = ({ data }) => {
    return (
        <div className="assigments-option">
            <label style={{ marginBottom: '1em' }}>Asignaturas</label>
            {(data && data.length) ?
                data.map(item => <AssigmentItem key={item.id} data={item} />) :
                (<p>No hay asignaturas para mostrar.</p>)
            }

        </div>
    );
}