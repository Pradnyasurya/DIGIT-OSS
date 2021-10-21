import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Card, CardSectionHeader, PDFSvg, Loader, StatusTable, Row, ActionBar, SubmitBar, CardLabel, MultiLink } from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import { downloadAndPrintReciept } from "../../../utils";

const DocumentDetails = ({ t, data, documents, paymentDetails }) => {
  return (
    <Fragment>
      {data?.map((document, index) => (
        <Fragment>
          <div style={{maxWidth: "940px", padding: "8px", borderRadius: "4px", border: "1px solid #D6D5D4", background: "#FAFAFA", marginBottom: "32px"}}>
            <div style={{fontSize: "16px", fontWeight: 700}}>{t(`BPA_${document?.documentType}`)}</div>
            <a target="_" href={documents[document.fileStoreId]?.split(",")[0]}>
              <PDFSvg />
            </a>
            <span> {decodeURIComponent( documents[document.fileStoreId].split(",")[0].split("?")[0].split("/").pop().slice(13))} </span>
          </div>
        </Fragment>
      ))}
      { paymentDetails?.Payments?.length > 0 && 
        <div>
        <CardSectionHeader>{`${t("BPA_FEE_DETAILS_LABEL")}`}</CardSectionHeader>
        <StatusTable>
          <Row className="border-none"  key={`${t(`BPAREG_FEES`)}:`} label={`${t(`BPAREG_FEES`)}:`} text={paymentDetails?.Payments?.[0]?.totalAmountPaid} />
          <Row className="border-none"  key={`${t(`BPA_STATUS_LABEL`)}:`} label={`${t(`PAID`)}:`} text={paymentDetails?.Payments?.[0]?.totalAmountPaid ? (t("WF_BPA_PAID")) : "NA"} textStyle={paymentDetails?.Payments?.[0]?.totalAmountPaid ? {color: "green"}: {}} />
        </StatusTable>
      </div>
      }
    </Fragment>
  );
}

const ApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split('.')[0]
  const [appDetails, setAppDetails] = useState({});
  const [showToast, setShowToast] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [dowloadOptions, setDowloadOptions] = useState([]);

  const stateCode = Digit.ULBService.getStateId();
  const language = Digit.StoreData.getCurrentLanguage();
  const moduleCode = ["bpareg", "bpa", "common"];
  const { data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  const { isLoading, data: applicationDetails } = Digit.Hooks.obps.useLicenseDetails(state, { applicationNumber: id, tenantId: state }, {});
  const { data: reciept_data, isLoading: recieptDataLoading } = Digit.Hooks.useRecieptSearch(
    {
      tenantId: stateCode,
      businessService: "BPAREG",
      consumerCodes: id,
      isEmployee: true
    },
    {}
  );

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.obps.useBPAREGApplicationActions(tenantId);

  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId?.split('.')[0],
    id: id,
    moduleCode: "BPAREG",
  });

  const closeToast = () => {
    setShowToast(null);
  };

  async function getRecieptSearch({tenantId,payments,...params}) {
    let response = { filestoreIds: [payments?.fileStoreId] };
    if (!payments?.fileStoreId) {
      response = await Digit.PaymentService.generatePdf(tenantId, { Payments: payments }, "consolidatedreceipt");
    }
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  useEffect(() => {
    if (applicationDetails) {
      if(reciept_data?.Payments?.length > 0) {
        setDowloadOptions([{
          label: t("TL_RECEIPT"),
          onClick: () => downloadAndPrintReciept(reciept_data?.Payments?.[0]?.paymentDetails?.[0]?.businessService || "BPAREG", applicationDetails?.applicationData?.applicationNumber, applicationDetails?.applicationData?.tenantId),
        }]);
      }
      const fileStoresIds = applicationDetails?.applicationData?.tradeLicenseDetail?.applicationDocuments.map(document => document?.fileStoreId);
      Digit.UploadServices.Filefetch(fileStoresIds, tenantId.split(".")[0])
        .then(res => {
          const { applicationDetails: details } = applicationDetails;
          setAppDetails({ ...applicationDetails, applicationDetails: [...details, { title: "CE_DOCUMENT_DETAILS", belowComponent: () => <DocumentDetails t={t} data={applicationDetails?.applicationData?.tradeLicenseDetail?.applicationDocuments} documents={res?.data} paymentDetails={reciept_data} /> }] })
        });
    }
    
  }, [applicationDetails, reciept_data]);

  return (
    <div >
      <div style={{marginLeft: "15px"}}>
        <Header>{t("CS_TITLE_APPLICATION_DETAILS")}</Header>
        {reciept_data?.Payments?.length > 0 && 
        <div style={{right: "3%", top: "20px", position: "absolute"}}>
        <MultiLink
          className="multilinkWrapper"
          onHeadClick={() => setShowOptions(!showOptions)}
          displayOptions={showOptions}
          options={dowloadOptions}
        />  
        </div>}
      </div>
      <ApplicationDetailsTemplate
        applicationDetails={appDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={appDetails?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService={workflowDetails?.data?.applicationBusinessService ? workflowDetails?.data?.applicationBusinessService : applicationDetails?.applicationData?.businessService}
        moduleCode="BPAREG"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"WF_NEWTL_"}
      />
    </div>
  )
}

export default ApplicationDetail;