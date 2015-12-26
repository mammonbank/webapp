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

    static acceptDepositApp(data) {
        return $.when(
            $.ajax({
                url: URLS.GET_DEPOSIT_APP_BY_ID.replace('${depositAppId}', data.depositAppId),
                method: 'DELETE',
                headers: { 'Authorization': DataProvider.getToken() },
                contentType: 'application/json',
                data: JSON.stringify({
                    isConfirmed: true
                })
            }),
            $.ajax({
                url: URLS.GET_DEPOSITS,
                method: 'POST',
                headers: { 'Authorization': DataProvider.getToken() },
                contentType: 'application/json',
                data: JSON.stringify({
                    sum: data.sum,
                    startDate: new Date(),
                    depositTypeId: data.depositTypeId,
                    clientId: data.clientId
                })
            })
        );
    }

    static declineDepositApp(data) {
        return $.ajax({
            url: URLS.GET_DEPOSIT_APP_BY_ID.replace('${depositAppId}', data.depositAppId),
            method: 'DELETE',
            headers: { 'Authorization': DataProvider.getToken() },
            contentType: 'application/json',
            data: JSON.stringify({
                isConfirmed: false
            })
        });
    }

    static acceptClient(data) {
        return $.ajax({
            url: URLS.GET_CLIENT_BY_ID.replace('${clientId}', data.clientId),
            method: 'PATCH',
            headers: { 'Authorization': DataProvider.getToken() },
            contentType: 'application/json',
            data: JSON.stringify({
                isConfirmed: true
            })
        });
    }

    static declineClient(data) {
        return $.ajax({
            url: URLS.GET_CLIENT_BY_ID.replace('${clientId}', data.clientId),
            method: 'DELETE',
            headers: { 'Authorization': DataProvider.getToken() }
        });
    }

    static createOperator(username, password) {
        return $.ajax({
            url: URLS.GET_OPERATORS,
            method: 'POST',
            headers: { 'Authorization': DataProvider.getToken() },
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: password,
                type: 'OPERATOR'
            })
        })
    }

    static createCreditCat(title) {
        return $.ajax({
            url: URLS.GET_CREDIT_CATS,
            method: 'POST',
            headers: { 'Authorization': DataProvider.getToken() },
            contentType: 'application/json',
            data: JSON.stringify({
                title: title
            })
        })
    }

    static createDepositType(data) {
        return $.ajax({
            url: URLS.GET_DEPOSIT_TYPES,
            method: 'POST',
            headers: { 'Authorization': DataProvider.getToken() },
            contentType: 'application/json',
            data: JSON.stringify({
                title: data.title,
                description: data.description,
                interest: data.interest,
                minSum: data.minSum
            })
        })
    }

    static createCreditType(data) {
        return $.ajax({
            url: URLS.GET_CREDIT_TYPES,
            method: 'POST',
            headers: { 'Authorization': DataProvider.getToken() },
            contentType: 'application/json',
            data: JSON.stringify({
                title: data.title,
                description: data.description,
                minSum: data.minSum,
                maxSum: data.maxSum,
                term: data.term,
                interest: data.interest,
                creditCategoryId: data.creditCategoryId
            })
        })
    }

}