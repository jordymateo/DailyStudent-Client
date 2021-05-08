import { Button } from 'devextreme-react';
import React, { useContext, useEffect, useState } from 'react';
import { CareerOrCourse } from '../../../../models';
import { InstitutionsService } from '../../../../services';
import "./institution.scss";
import { formatDate } from "devextreme/localization";
import notify from 'devextreme/ui/notify';
import { CreatePopup } from '../../../Institutions';
import UserInstitutionsContext from '../../../../context/UserInstitutionsContext';

interface IInstitutionItemProps {
  item: CareerOrCourse;
  onDataChanged: () => void;
}

const InstitutionItem: React.FC<IInstitutionItemProps> = ({ item, onDataChanged }) => {

  const onStateChange = () => {
    if (item.courseTypeId === 'course') {
      InstitutionsService.toggleUserCourseState(item.id)
        .then((data) => {
          onDataChanged();
          notify({ message: `Curso ${item.isDeleted ? 'habilidato' : 'deshabilitado'} correctamente!`, width: 'auto' }, "success", 4500);
        });
    } else {
      InstitutionsService.toggleUserCareerState(item.id)
        .then((data) => {
          onDataChanged();
          notify({ message: `Carrera ${item.isDeleted ? 'habilidata' : 'deshabilitada'} correctamente!`, width: 'auto' }, "success", 4500);
        });
    }
  }

  return (
    <div className="institution-body-item">
      <div className="institution-body-item-logo">
        <img src={item.institutionLogo} width="40" alt="" />
      </div>
      <div className="institution-body-item-content">
        <div className="institution-body-item-header">
          <div className="institution-body-item-title">
            <span className="institution-item-title-career">{item.name}</span>
            <span className="institution-item-title-name">{item.institutionAcronym} - {item.institutionName}</span>
          </div>
          <div className="institution-body-item-options">
            <Button
              text={item.isDeleted ? "HABILITAR" : "DESHABILITAR"}
              type="danger"
              stylingMode="text"
              onClick={onStateChange}
            />
          </div>
        </div>
        <div className="institution-body-item-info">
          <div><strong>Tipo: </strong>{item.courseTypeId === 'course' ? 'Curso' : 'Carrera'}</div>
          <div><strong>Fecha de creación: </strong>{formatDate(new Date(item.creationDate), 'EEEE, d MMM, yyyy')}</div>
        </div>
      </div>
    </div>

  );
}

const Institutions: React.FC<any> = () => {
  const [createPopUpVisible, setCreatePopUpVisible] = useState<boolean>(false);
  const [institutions, setInstitutions] = useState<CareerOrCourse[]>();

  const [, loadInstitutions] = useContext(UserInstitutionsContext);

  const loadData = (affectSideBar: boolean) => {
    InstitutionsService.getUserInstitutionsInLine()
      .then((data) => {
        setInstitutions(data);
        if (affectSideBar)
          loadInstitutions();
      });
  };

  useEffect(() => {
    loadData(false);
  }, []);

  return (
    <div>
      <div className="institution" >
        <div className="institution-header">
          <h2><b>Carreras y cursos</b></h2>
          <div>
            <Button
              text="AGREGAR CARRERA / CURSO"
              type="danger"
              stylingMode="text"
              icon="add"
              onClick={() => setCreatePopUpVisible(true)}
            />
          </div>
        </div>
        <div className="institution-body">
          {institutions && institutions.map(item => (
            <InstitutionItem
              key={item.id}
              item={item}
              onDataChanged={() => loadData(true)}
            />
          ))}
        </div>
      </div>
      <CreatePopup
        visible={createPopUpVisible}
        onHidden={() => setCreatePopUpVisible(false)}
        afterSubmit={() => loadData(true)}
      />
    </div>
  );
}

export default Institutions;