/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.tl.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.egov.tl.entity.FeeMatrix;
import org.egov.tl.entity.FeeMatrixDetail;
import org.egov.tl.repository.FeeMatrixDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FeeMatrixDetailService {

    private final FeeMatrixDetailRepository feeMatrixDetailRepository;

    @Autowired
    public FeeMatrixDetailService(final FeeMatrixDetailRepository feeMatrixDetailRepository) {
        this.feeMatrixDetailRepository = feeMatrixDetailRepository;
    }

    public List<FeeMatrixDetail> findAll() {
        return feeMatrixDetailRepository.findAll(new Sort(Sort.Direction.ASC, "name"));
    }

    public FeeMatrixDetail findByLicenseFeeByRange(final FeeMatrix feeMatrix,
            final BigDecimal uom, final Date date, final long financialYearId) {
        return feeMatrixDetailRepository.findFeeDetailList(feeMatrix, uom.intValue(), date, financialYearId);

    }

    public FeeMatrixDetail findByFeeMatrixDetailId(final Long feeMatrixDetailId) {
        final FeeMatrixDetail feeMatrixDetail = feeMatrixDetailRepository.findOne(feeMatrixDetailId);
        return feeMatrixDetail;
    }

    @Transactional
    public void delete(final FeeMatrixDetail feeMatrixDetail) {
        feeMatrixDetailRepository.delete(feeMatrixDetail);
    }

    public List<FeeMatrixDetail> searchFeeMatrix(final Long licenseCategory, final Long subCategory, final Long financialYear) {
        return feeMatrixDetailRepository.findByParams(licenseCategory, subCategory, financialYear);

    }

}