import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, DropDownBox, TextBox, TreeView } from "devextreme-react";
import Images from "../../assets/images";
import { Assigments } from "./parts/AssigmentsSidebar/Assigments";
import { Menu } from "./parts/MenuSidebar/Menu";
import { UserOption } from "./parts/UserOptionSidebar/UserOption";
import { PensumsService } from "../../services";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Course } from "../../models";
import UserInstitutionsContext from "../../context/UserInstitutionsContext";


const InstitutionTreeOption = ({ data, index }: any) => {
  return (
    <div className="treeview-institution-option">
      {data.logoPath && (<img src={data.logoPath} />)}<label className={data.isGroup ? 'option-group' : ''}>{data.name}</label>
    </div>
  );
}

const InstitutionDropDownField = (data: any) => {
  if (!data)
    return (<TextBox disabled />);
  return (
    <div className="dropdown-institution-field">
      <img src={data.institutionLogo} />
      <div className="dropdown-institution-text">
        <label>{data.institutionName}</label>
        <label>{data.name}</label>
        <TextBox disabled style={{ display: 'none' }}></TextBox>
      </div>
    </div>
  );
}



const InstitutionsTreeOptions = ({ refChild, data, selected, onSelectionChange }: any) => {
  return (
    <TreeView
      ref={refChild}
      dataSource={data}
      keyExpr="uId"
      dataStructure="tree"
      //itemsExpr="items"
      selectionMode="single"
      displayExpr="name"
      selectByClick={true}
      itemComponent={InstitutionTreeOption}
      onItemSelectionChanged={onSelectionChange}
    />
  );
}

const getFirstItem: any = (data: any) => {
  for (let i in data) {
    let element;
    if (data[i]['items'] && data[i]['items'].length) {
      element = getFirstItem(data[i]['items']);
    } else {
      if (data[i]['courseTypeId'])
        return data[i];
    }
    if (element) return element;
  }
}

const verifyItem: any = (data: any, toVerify: any) => {
  for (let i in data) {
    let element;
    if (data[i]['items'] && data[i]['items'].length) {
      element = verifyItem(data[i]['items'], toVerify);
    } else {
      if (data[i]['id'] == toVerify['id'])
        return true;
    }
    if (element) return element;
  }
  return false;
}



export const Sidebar: React.FC = () => {

  const selectedIdentifier = 'selected-user-option';

  const history = useHistory();
  const match = useRouteMatch();
  const [selected, setSelected] = useState<any>();
  const treeView = useRef<TreeView>();
  const dropDownBox = useRef<DropDownBox | any>();
  const [subjects, setSubjects] = useState<Course[]>([]);

  const [institutions, loadInstitutions] = useContext(UserInstitutionsContext);

  useEffect(() => {
    loadInstitutions();
  }, []);

  useEffect(() => {
    if (institutions && institutions.length) {
      var dataToLoad: any = localStorage.getItem(selectedIdentifier);

      if (dataToLoad) {
        dataToLoad = JSON.parse(dataToLoad);

        if (verifyItem(institutions, dataToLoad)) {
          if (selected && selected['id'] == dataToLoad['id'])
            return;
          setSelected(dataToLoad);
        } else {
          localStorage.removeItem(selectedIdentifier);
          dataToLoad = getFirstItem(institutions);
          localStorage.setItem(selectedIdentifier, JSON.stringify(dataToLoad));
          setSelected(dataToLoad);
        }
      } else {
        dataToLoad = getFirstItem(institutions);
        localStorage.setItem(selectedIdentifier, JSON.stringify(dataToLoad));
        setSelected(dataToLoad);
      }

      if (match.url === '/') {
        if (dataToLoad.courseTypeId === 'course')
          history.push(`/courses/${dataToLoad.id}`);
        else
          history.push(`/assignments/${dataToLoad.id}`);

      }
      else if (match.url.startsWith('/courses') || match.url.startsWith('/assignments')) {
        let targetUrl = '';
        if (dataToLoad.courseTypeId === 'course')
          targetUrl = `/courses/${dataToLoad.id}`;
        else
          targetUrl = `/assignments/${dataToLoad.id}`;

        if (match.url !== targetUrl)
          history.push(targetUrl);
      }
    }
  }, [institutions]);

  useEffect(() => {
    if (selected && selected.courseTypeId === 'career') {
      PensumsService.getUserSubjects(selected.id).then((data) => setSubjects(data));
    } else {
      setSubjects([]);
    }
  }, [selected]);

  const onSelectionChange = ({ event, itemData }: any) => {
    if (event && itemData && itemData.courseTypeId) {
      setSelected(itemData);
      if (itemData.courseTypeId === 'course') {
        history.push(`/courses/${itemData.id}`);
      } else {
        //InstitutionsService.getUserInstitutions().then((data) => setInstitutions(data));
      }

      localStorage.setItem(selectedIdentifier, JSON.stringify(itemData));
      dropDownBox.current?.instance.close();
    }
  }

  const onDropDownSelectionChange = (e: any) => {
    setSelected(e.value);

    if (!treeView) return;

    if (!e.value) {
      treeView.current?.instance.unselectAll();
    } else {
      treeView.current?.instance.selectItem(e.value);
    }
  }

  const onHomeClick = () => {
    if (selected) {
      if (selected.courseTypeId === 'course')
        history.push(`/courses/${selected.id}`);
      else
        history.push(`/assignments/${selected.id}`);
    } else {
      history.push('/')
    }
  };

  return (
    <div className="side-bar">
      <div className="menu-options">
        {/* <Button
          icon={'menu'}
          width="auto"
          height="40px"
          stylingMode={'text'}
          className="button-dark"
          style={{ marginTop: '10px' }}
        /> */}
        <img src={Images.Logo} onClick={onHomeClick} />
        <label onClick={onHomeClick}>Daily Student</label>
      </div>
      <div className="institutions-option">
        <DropDownBox
          ref={dropDownBox}
          // deferRendering={false}
          valueExpr="id"
          displayExpr="name"
          placeholder="Selecciona una institución"
          showClearButton={false}
          //dataSource={institutions}
          value={selected}
          onValueChanged={onSelectionChange}
          fieldRender={InstitutionDropDownField}
          contentRender={() =>
            <InstitutionsTreeOptions
              refChild={treeView}
              data={institutions}
              onSelectionChange={onSelectionChange}
            />
          }
        />
      </div>
      <Menu disabled={!selected ? true : selected.courseTypeId !== 'career'} selectedId={selected ? selected.id : undefined} />
      <Assigments data={subjects} />
      <UserOption />
    </div>
  );
}