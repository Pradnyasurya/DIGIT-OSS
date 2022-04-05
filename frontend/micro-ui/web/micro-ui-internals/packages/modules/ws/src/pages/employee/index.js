import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import ApplicationBillAmendment from "./ApplicationBillAmendment";
import RequiredDocuments from "./RequiredDocuments";
import NewApplication from "./NewApplication";
import WSDocsRequired from "../../pageComponents/WSDocsRequired";
import ApplicationDetails from "./ApplicationDetails";
import GetConnectionDetails from "./connectionDetails/connectionDetails";
import ActivateConnection from "./ActivateConnection";
import WSResponse from "./WSResponse";
// import SearchConnectionComponent from "./SearchConnection";
// import SearchResultsComponent from "./SearchResults";
import Search from "./search";
import SearchWater from "./SearchWater";
import EditApplication from "./EditApplication";
import ConsumptionDetails from "./connectionDetails/ConsumptionDetails";
const App = ({ path }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <BreadCrumb></BreadCrumb>
      <Switch>
        <PrivateRoute path={`${path}/create-application`} component={WSDocsRequired} />
        <PrivateRoute path={`${path}/new-application`} component={NewApplication} />
        <PrivateRoute path={`${path}/edit-application`} component={EditApplication} />
        <PrivateRoute path={`${path}/application-details`} component={ApplicationDetails} />
        <PrivateRoute path={`${path}/connection-details`} component={GetConnectionDetails} />
        <PrivateRoute path={`${path}/bill-amendment`} component={() => <ApplicationBillAmendment {...{ path }} />} />
        <PrivateRoute path={`${path}/required-documents`} component={() => <RequiredDocuments {...{ path }} />} />
        <PrivateRoute path={`${path}/activate-connection`} component={ActivateConnection} />
        <PrivateRoute path={`${path}/search-application`} component={(props) => <Search {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/response`} component={WSResponse} />
        <PrivateRoute path={`${path}/search`} component={(props) => <SearchWater {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/consumption-details`} component={ConsumptionDetails} />

        {/* <Route path={`${path}/search`} component={SearchConnectionComponent} />
        <Route path={`${path}/search-results`} component={SearchResultsComponent} /> */}
      </Switch>
    </React.Fragment>
  );
};

export default App;