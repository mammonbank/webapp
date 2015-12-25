class DataManipulator {
    static acceptCreditApp(data) {
        return $.when(
            $.ajax({
                url: URLS.GET_CREDIT_APP_BY_ID.replace('${creditAppId}', data.creditAppId),
                method: 'DELETE',
                headers: { 'Authorization': DataProvider.getToken() },
                contentType: 'application/json',
                data: JSON.stringify({
                    isConfirmed: true
                })
            }),
            $.ajax({
                url: URLS.GET_CREDITS,
                method: 'POST',
                headers: { 'Authorization': DataProvider.getToken() },
                contentType: 'application/json',
                data: JSON.stringify({
                    sum: data.sum,
                    repaymentType: data.repaymentType,
                    startDate: new Date(),
                    endDate: moment().add(data.term, 'months'),
                    creditTypeId: data.creditTypeId,
                    clientId: data.clientId
                })
            })
        );
    }

    static declineCreditApp(data) {
        return $.ajax({
            url: URLS.GET_CREDIT_APP_BY_ID.replace('${creditAppId}', data.creditAppId),
            method: 'DELETE',
            headers: { 'Authorization': DataProvider.getToken() },
            contentType: 'application/json',
            data: JSON.stringify({
                isConfirmed: false
            })
        });
    }
}