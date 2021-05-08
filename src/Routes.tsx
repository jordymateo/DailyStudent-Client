import React, { useEffect, useState } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AuthLayout, Loading, MainLayout } from './components/Layouts';
import { Assigments } from './pages/Assigments';
import { ChangePassword, ForgotPassword, SignIn, SignUp, Verify } from './pages/Authentication';
import { Home } from './pages/Home';
import { Auth } from './services';
import { locale, loadMessages } from "devextreme/localization";
import esMessages from "devextreme/localization/messages/es.json";
import { Course } from './pages/Courses';
import { Calendar } from './pages/Calendar';
import UserInstitutionsContext from './context/UserInstitutionsContext';
import useUserInstitutions from './context/useUserInstitutions';


const SecurityRoutes: React.FC<any> = ({ history, location }) => {
  const [loading, setLoading] = useState(true);
  const [authIsValid, setAuthIsValid] = useState(false);
  const userInstitutions = useUserInstitutions();

  useEffect(() => {
    Auth
      .loadUserData()
      .then((isValid) => {
        setAuthIsValid(isValid);
        setTimeout(() => {
          setLoading(false);
        }, 2500)
      })
      .catch((err) =>
        setTimeout(() => {
          setAuthIsValid(false);
          setLoading(false);
        }, 2500)
      );
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!authIsValid && !loading) {
    Auth.signOut();
    history.push("/sign_in");
  }

  return (
    <UserInstitutionsContext.Provider value={userInstitutions}>
      <MainLayout>
        <Switch>
          <Route exact path="/assignments/:id" component={Assigments} />
          <Route path="/courses/:id" component={Course} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/" component={Home} />
        </Switch>
      </MainLayout>
    </UserInstitutionsContext.Provider>
  );
};

const GuestRoutes = () => {
  return (
    <AuthLayout>
      <Switch>
        <Route path="/sign_in" component={SignIn} />
        <Route path="/sign_up" component={SignUp} />
        <Route path="/forgot_password" component={ForgotPassword} />
        <Route path="/cp/:tk" component={ChangePassword} />
        <Route path="/v/:tk" component={Verify} />
        <Redirect to="/sign_in" />
      </Switch>
    </AuthLayout>
  )
}


const Routes = () => {
  //language
  loadMessages(esMessages);
  locale(navigator.language);

  const loading = useState<boolean>(false);

  return (
    <HashRouter basename={"/"}>
      <Route
        render={(_) =>
          Auth.isAuthenticated ? (
            <Route path="*" component={SecurityRoutes} />
          ) : (
            <Route path="*" component={GuestRoutes} />
          )
        }
      />
    </HashRouter>
  );
};

export default Routes;