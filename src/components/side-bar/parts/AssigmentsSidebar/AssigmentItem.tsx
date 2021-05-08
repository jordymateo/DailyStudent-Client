import React from "react";
import { useHistory } from "react-router-dom";
import { IAssignmentItemProps } from "../../types";

export const AssigmentItem: React.FC<IAssignmentItemProps> = ({data}) => {
    const history = useHistory();
    
    return (
        <div className="assigments-option-item" onClick={() => history.push(`/courses/${data.id}`)}>
            <div className="assigment-avatar">
                <div className="assigment-avatar-wrap" style={{backgroundColor: '#' + data.color, opacity: '0.6'}}>
                    <label>{data.name.substr(0, 2)}</label>
                </div>
            </div>
            <div className="assigment-content">
                <label className="assigment-content-title">{data.name}</label>
                <label className="assigment-content-code">{data.teacherFullName}</label>
            </div>
        </div>
    );
}