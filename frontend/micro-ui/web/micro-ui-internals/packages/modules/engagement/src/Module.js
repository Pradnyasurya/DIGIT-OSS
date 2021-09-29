import { Loader, PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Redirect, Switch, useLocation, useRouteMatch, Route } from "react-router-dom";


import EngagementCard from "./components/EngagementCard";
import EngagementDocSelectULB from "./components/Documents/EngagementDocsULB";
import EnagementDocName from "./components/Documents/engagement-doc-name";
import EngagementDocCategory from "./components/Documents/engagement-doc-category";
import EngagementDocDescription from "./components/Documents/engagement-doc-description";
import EngagementDocUploadDocument from "./components/Documents/engagement-doc-documents";
import NewEvent from "./pages/employee/Events/NewEvent";
import EditEvent from "./pages/employee/Events/EditEvent";
import Response from "./pages/employee/Events/NewEvent/Response";
import Inbox from "./pages/employee/Events/Inbox";
import EventForm from "./components/Events/EventForm";
import SelectEventGeolocation from "./components/Events/SelectGeoLocation";
import SelectToDate from "./components/Events/SelectToDate";
import NotificationsAndWhatsNew from "./pages/citizen/NotificationsAndWhatsNew";
import EventsListOnGround from "./pages/citizen/EventsListOnGround";
import EmployeeEventDetails from "./pages/employee/Events/EventDetails";
import CitizenApp from "./pages/citizen";
import EventDetails from "./pages/citizen/EventsListOnGround/EventDetails";
import DocumenetCreate from "./pages/employee/Documents/documents-create";
import DocumentResponse from "./pages/employee/Documents/response";
import DocUpdate from "./pages/employee/Documents/doc-update";
import DocUpdateResponse from "./pages/employee/Documents/update-response";
import DocDeleteResponse from "./pages/employee/Documents/delete-response";
import DocumentNotification from "./pages/employee/Documents/Inbox";
import DocumentList from './pages/citizen/Documents/DocumentList';
import DocumentDetails from "./components/Documents/DocumentDetails";
 
const EventsBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: true,
    },
    {
      path: "/digit-ui/employee/engagement/event/inbox",
      content: t("ES_EVENT_INBOX"),
      show: location.pathname.includes("event/inbox") ? true : false,
    },
    {
      path: "/digit-ui/employee/event/inbox/new-event",
      content: t("ES_EVENT_NEW_EVENT"),
      show: location.pathname.includes("event/inbox/new-event") ? true : false,
    },
    {
      path: "/digit-ui/employee/engagement/event/edit-event",
      content: t("ES_EVENT_EDIT_EVENT"),
      show: location.pathname.includes("event/edit-event") ? true : false,
    },
    {
      path: "/digit-ui/employee/event/response",
      content: t("ES_EVENT_NEW_EVENT_RESPONSE"),
      show: location.pathname.includes("event/response") ? true : false,
    },
    {
      path: "/digit-ui/employee/engagement/documents/inbox",
      content: t("ES_EVENT_INBOX"),
      show: location.pathname.includes("/documents/inbox") ? true : false,
    },
    {
      path: "/digit-ui/employee/engagement/documents/inbox/new-doc",
      content: t("NEW_DOCUMENT_TEXT"),
      show: location.pathname.includes("/documents/inbox/new-doc") ? true : false,
    },
    {
      path: "/digit-ui/employee/engagement/documents/new/response",
      content: t("DOCUMENTS_DOCUMENT_HEADER"),
      show: location.pathname.includes("/documents/response") ? true : false,
    },
    {
      path: "/digit-ui/employee/engagement/documents/inbox/details/:id",
      content: t("DOCUMENTS_DOCUMENT_HEADER"),
      show: location.pathname.includes("/documents/inbox/details") ? true : false,
    },

  ];

  return <BreadCrumb crumbs={crumbs} />;
};

const EmployeeApp = ({ path, url, userType, tenants }) => {
  const location = useLocation();

  return (
    <div className="ground-container">
      <EventsBreadCrumb location={location} />
      <Switch>
        <Route exact path={`${path}/documents/inbox/new-doc`} component={() => <DocumenetCreate {...{ path }} />} />
        <Route path={`${path}/event/inbox`} exact>
          <Inbox tenants={tenants} parentRoute={path} />
        </Route>
        <Route path={`${path}/event/response`} component={(props) => <Response {...props} />} />
        <Route path={`${path}/event/inbox/new-event`}>
          <NewEvent />
        </Route>
        <Route path={`${path}/event/edit-event/:id`}>
          <EditEvent />
        </Route>
        <Route path={`${path}/event/:id`}>
          <EmployeeEventDetails />
        </Route>
        <Route path={`${path}/documents/inbox/details/:id`} component={(props) => <DocumentDetails {...props} />} />
        <Route path={`${path}/documents/response`} component={(props) => <DocumentResponse {...props} />} />
        <Route path={`${path}/documents/update`} component={(props) => <DocUpdate {...props} />} />
        <Route path={`${path}/documents/update-response`} component={(props) => <DocUpdateResponse {...props} />} />
        <Route path={`${path}/documents/delete-response`} component={(props) => <DocDeleteResponse {...props} />} />
        <Route path={`${path}/documents/inbox`} component={(props) => <DocumentNotification tenants={tenants} />} />
        {/* documents/update-response */}
        {/* <Redirect to={`${path}/docs`} /> */}
      </Switch>
    </div>
  );
};

const EngagementModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "Engagement";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }
  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);

  if (userType === "citizen") {
    return <CitizenApp path={path} url={url} userType={userType} />;
  } else {
    return <EmployeeApp path={path} url={url} userType={userType} tenants={tenants} />;
  }
};

const EngagementLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  if (userType === "citizen") {
    return null;
  } else {
    return (
      <div className="employee-app-container">
        <div className="ground-container">
          <div className="employeeCard">
            <div className="complaint-links-container">
              <div className="header">
                <span className="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                      fill="white"
                    ></path>
                  </svg>
                </span>
                <span className="text">{t("ES_TITLE_ENGAGEMENT")}</span>
              </div>
              <div className="body">
                <h1>engagement</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const componentsToRegister = {
  EngagementModule,
  EngagementCard,
  EngagementDocSelectULB,
  EnagementDocName,
  EngagementDocCategory,
  EngagementDocDescription,
  EngagementDocUploadDocument,
  NotificationsAndWhatsNew,
  EventsListOnGround,
  EventDetails,
  EventForm,
  DocumentList,
  SelectEventGeolocation,
  SelectToDate
};

export const initEngagementComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
