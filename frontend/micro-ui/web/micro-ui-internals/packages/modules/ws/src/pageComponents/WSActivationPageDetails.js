import { CardLabel, LabelFieldPair, TextInput, CardLabelError, DatePicker } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { getPattern } from "../utils";
import * as func from "../utils";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const createActivationDetails = () => ({
    meterId: "",
    meterInstallationDate: null,
    meterInitialReading: "",
    connectionExecutionDate: null
});


const WSActivationPageDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const filters = func.getQueryStringParams(location.search);
    const [activationDetails, setActivationDetails] = useState(formData?.activationDetails || [createActivationDetails()]);
    const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
    const [isErrors, setIsErrors] = useState(false);

    useEffect(() => {
        const data = activationDetails.map((e) => {
            return e;
        });
        onSelect(config?.key, data);
    }, [activationDetails]);

    const commonProps = {
        focusIndex,
        allOwners: activationDetails,
        setFocusIndex,
        formData,
        formState,
        t,
        setError,
        clearErrors,
        config,
        setActivationDetails,
        setIsErrors,
        isErrors,
        activationDetails,
        filters
    };

    return (
        <React.Fragment>
            {activationDetails.map((activationDetail, index) => (
                <ConnectionDetails key={activationDetail.key} index={index} activationDetail={activationDetail} {...commonProps} />
            ))}
        </React.Fragment>
    );
};

const ConnectionDetails = (_props) => {
    const {
        activationDetail,
        index,
        focusIndex,
        allOwners,
        setFocusIndex,
        t,
        formData,
        config,
        setError,
        clearErrors,
        formState,
        isEdit,
        activationDetails,
        setIsErrors,
        isErrors,
        filters,
        setActivationDetails
    } = _props;

    const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
    const formValue = watch();
    const { errors } = localFormState;
    const isMobile = window.Digit.Utils.browser.isMobile();

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        if (Object.entries(formValue).length > 0) {
            const keys = Object.keys(formValue);
            const part = {};
            keys.forEach((key) => (part[key] = activationDetail[key]));
            if (!_.isEqual(formValue, part)) {
                Object.keys(formValue).map(data => {
                    if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
                        setIsErrors(true);
                    }
                });
                let ob = [{ ...formValue }];
                let mcollectFormValue = JSON.parse(sessionStorage.getItem("mcollectFormData"));
                mcollectFormValue = { ...mcollectFormValue, ...ob[0] }
                sessionStorage.setItem("mcollectFormData", JSON.stringify(mcollectFormValue));
                setActivationDetails(ob);
                trigger();
            }
        }
    }, [formValue]);


    useEffect(() => {
        if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
            setError(config.key, { type: errors });
        }
        else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
            clearErrors(config.key);
        }
    }, [errors]);

    const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

    return (
        <div>
            <div style={{ marginBottom: "16px" }}>
                {filters?.service === "WATER" && formData?.connectionDetails?.[0]?.connectionType?.code?.toUpperCase() === "METERED" ? <div>
                    <LabelFieldPair>
                        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_METER_ID")} :`}</CardLabel>
                        <div className="field">
                            <Controller
                                control={control}
                                name="meterId"
                                defaultValue={activationDetail?.meterId}
                                type="number"
                                rules={{ validate: (e) => ((e && getPattern("Amount").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) }}
                                render={(props) => (
                                    <TextInput
                                        type="number"
                                        value={props.value}
                                        autoFocus={focusIndex.index === activationDetail?.key && focusIndex.type === "meterId"}
                                        errorStyle={(localFormState.touched.meterId && errors?.meterId?.message) ? true : false}
                                        onChange={(e) => {
                                            props.onChange(e.target.value);
                                            setFocusIndex({ index: activationDetail?.key, type: "meterId" });
                                        }}
                                        labelStyle={{ marginTop: "unset" }}
                                        onBlur={props.onBlur}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.meterId ? errors?.meterId?.message : ""}</CardLabelError>
                    <LabelFieldPair>
                        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_ADDN_DETAIL_METER_INSTALL_DATE")}:`}</CardLabel>
                        <div className="field">
                            <Controller
                                name="meterInstallationDate"
                                // rules={{ required: t("REQUIRED_FIELD") }}
                                // isMandatory={true}
                                defaultValue={activationDetail?.meterInstallationDate}
                                control={control}
                                render={(props) => (
                                    <DatePicker
                                        date={props.value}
                                        name="meterInstallationDate"
                                        onChange={props.onChange}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.meterInstallationDate ? errors?.meterInstallationDate?.message : ""}</CardLabelError>
                    <LabelFieldPair>
                        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_INITIAL_METER_READING_LABEL")} :`}</CardLabel>
                        <div className="field">
                            <Controller
                                type="number"
                                control={control}
                                name="meterInitialReading"
                                defaultValue={activationDetail?.meterInitialReading}
                                rules={{ validate: (e) => ((e && getPattern("Amount").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) }}
                                render={(props) => (
                                    <TextInput
                                        type="number"
                                        value={props.value}
                                        autoFocus={focusIndex.index === activationDetail?.key && focusIndex.type === "meterInitialReading"}
                                        errorStyle={(localFormState.touched.meterInitialReading && errors?.meterInitialReading?.message) ? true : false}
                                        onChange={(e) => {
                                            props.onChange(e.target.value);
                                            setFocusIndex({ index: activationDetail?.key, type: "meterInitialReading" });
                                        }}
                                        labelStyle={{ marginTop: "unset" }}
                                        onBlur={props.onBlur}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.meterInitialReading ? errors?.meterInitialReading?.message : ""}</CardLabelError>
                </div> : null}
                <LabelFieldPair>
                    <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_CONN_EXECUTION_DATE")}*:`}</CardLabel>
                    <div className="field">
                        <Controller
                            name="connectionExecutionDate"
                            rules={{ required: t("REQUIRED_FIELD") }}
                            isMandatory={true}
                            defaultValue={activationDetail?.connectionExecutionDate}
                            control={control}
                            render={(props) => (
                                <DatePicker
                                    date={props.value}
                                    name="connectionExecutionDate"
                                    onChange={props.onChange}
                                    autoFocus={focusIndex.index === activationDetail?.key && focusIndex.type === "connectionExecutionDate"}
                                    errorStyle={(localFormState.touched.connectionExecutionDate && errors?.connectionExecutionDate?.message) ? true : false}
                                />
                            )}
                        />
                    </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.connectionExecutionDate ? errors?.connectionExecutionDate?.message : ""}</CardLabelError>
            </div>
        </div>
    );
};

export default WSActivationPageDetails;