import React, { useEffect } from "react"
import { StandaloneSearchBar, Loader, CardBasedOptions, ComplaintIcon, PTIcon, CaseIcon, DropIcon, HomeIcon, Calender, DocumentIcon, HelpIcon, WhatsNewCard } from "@egovernments/digit-ui-react-components"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom";

const Home = () => {
    
    const { t } = useTranslation()
    const history = useHistory()
    const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code
    const { data: { stateInfo } = {}, isLoading } = Digit.Hooks.useStore.getInitData()

    const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({tenantId})
    // if(!Digit.UserService?.getUser()?.access_token){
    //     history.push(`/digit-ui/citizen/login?from=${encodeURIComponent(window.location.pathname + window.location.search)}`)
    // }

    if(!tenantId){
        history.push(`/digit-ui/citizen/select-language`)
    }

    const allCitizenServicesProps = {
        header: t("DASHBOARD_CITIZEN_SERVICES_LABEL"),
        sideOption:{ 
            name: t("DASHBOARD_VIEW_ALL_LABEL"),
            onClick: () => history.push("/digit-ui/citizen/all-services")
        },
        options: [
            {
                name:  t("ES_PGR_HEADER_COMPLAINT"), 
                Icon: <ComplaintIcon/>,
                onClick: () => history.push("/digit-ui/citizen/pgr-home")
            },
            {
                name: t("MODULE_PT"), 
                Icon: <PTIcon className="fill-path-primary-main" />,
                onClick: () => history.push("/digit-ui/citizen/pt-home")
            },
            {
                name: t("MODULE_TL"), 
                Icon: <CaseIcon className="fill-path-primary-main" />,
                onClick: () => history.push("/digit-ui/citizen/tl-home")
            },
            {
                name: t("ACTION_TEST_WATER_AND_SEWERAGE"), 
                Icon: <DropIcon/>,
                onClick: () => history.push("/digit-ui/citizen")
            }
        ]
    }
    const allInfoAndUpdatesProps = {
        header: t("CS_COMMON_DASHBOARD_INFO_UPDATES"),
        sideOption:{ 
            name: t("DASHBOARD_VIEW_ALL_LABEL"),
            onClick: () => console.log("view all")
        },
        options: [
            {
                name: t("CS_HEADER_MYCITY"),
                Icon: <HomeIcon/>,
            },
            {
                name: t("EVENTS_EVENTS_HEADER"),
                Icon: <Calender/>,
                onClick: () => history.push("/digit-ui/citizen/engagement/events")
            },
            {
                name: t("CS_COMMON_DOCUMENTS"),
                Icon: <DocumentIcon/>,
                onClick: () => history.push("/digit-ui/citizen/engagement/docs")
            },
            {
                name: t("CS_COMMON_HELP"),
                Icon: <HelpIcon/>
            }
        ]
    }

    return isLoading ? <Loader/> : <div className="HomePageWrapper">
        
        <div className="BannerWithSearch">
            <img src={stateInfo?.bannerUrl}/>
            <div className="Search">
                <StandaloneSearchBar placeholder={t("CS_COMMON_SEARCH_PLACEHOLDER")} />
            </div>
        </div>

        <div className="ServicesSection">
            <CardBasedOptions {...allCitizenServicesProps} />
            <CardBasedOptions {...allInfoAndUpdatesProps} />
        </div>

        {Digit.UserService?.getUser()?.access_token ? EventsDataLoading ? <Loader /> : <div className="WhatsNewSection">
            <div className="headSection">
                <h2>{t("DASHBOARD_WHATS_NEW_LABEL")}</h2>
                <p onClick={() => history.push("/digit-ui/citizen/engagement/whats-new")}>{t("DASHBOARD_VIEW_ALL_LABEL")}</p>
            </div>
            <WhatsNewCard {...EventsData?.[0]} />
        </div> : null}

    </div>
}

export default Home