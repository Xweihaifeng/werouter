var ajax = {};
ajax = axios.create({
    baseURL: api_domain,
    timeout: 30000,
});

// http request 拦截器
ajax.interceptors.request.use(
    config => {
        config.headers.Token = localStorage.getItem('token');
        return config;
    }
);

ajax.interceptors.response.use(
    response => {
        switch (response.data.code){
            case 200:
                if (response.data.message == 'Success'){
                    return response.data;
                }
                else
                {
                    return false;
                }
                break;
            case -200:
                return response.data;
                break;
            case 401:
                window.location.href = '/login?url='+window.location.pathname;
                break;
        }
    }
);

