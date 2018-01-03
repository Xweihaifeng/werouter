var ajax = {};
ajax = axios.create({
    // baseURL: api_domain,
    baseURL: apiUrl,
    timeout: 30000,
});

// http request 拦截器
ajax.interceptors.request.use(
    config => {
        if(is_login == 'yes'){
            config.headers.Token = plats_token;
        }
        config.headers.apiAuth = auth_code;
        return config;
    }
);
// 如果是 401 没有权限需要重新编写LOGIN程序
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
                mb_login(window.location.pathname);
                return false;
                break;
        }
    }
);

