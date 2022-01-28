import _ from "lodash";
import axios from "axios";

const baseURL = "http://localhost:8626/api";

const instance: any = axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
    "charset": "utf-8"
  }
});

const instanceMultipart = axios.create({
  baseURL: baseURL
});

const iRes = (response) => {
  const innerData = _.get(response, "data");
  if (!_.isUndefined(innerData)) {
    console.info("Ответ сервера:", innerData?.message);
    return innerData.data;
  }
}

const iErr = (error) => {
  const srvErrMsg = _.get(error, "response.data.message", "");
  if (axios.isCancel(error)) {
    console.info("Запрос был прерван пользователем.");
  } else {
    console.error("Ошибка в ответе сервера:", srvErrMsg);
  }

  if (error?.response?.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/";
    return Promise.reject(srvErrMsg);
  }

  return Promise.reject(srvErrMsg);
}

instance.interceptors.response.use(iRes, iErr);
instanceMultipart.interceptors.response.use(iRes, iErr);

const _objToForm = (obj) => {
  let formData = new FormData();
  _.each(obj, (k, v)=> {
    formData.append(v, k);
  })
  return formData
}

const _getProgressEvent = (progressEvent) => _.isFunction(progressEvent) ? progressEvent : ()=>{};

export const getCancelToken = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return [source.token, source.cancel];
}

export const serverQuery = (method, url, token?, data?, params?, progressEvent?, cancelToken?) => {
  return instance({
    method: _.toString(method).toUpperCase(),
    url: url,
    headers: {
      token: token,
      onUploadProgress: _getProgressEvent(progressEvent),
    },
    data: data,
    params: params,
    cancelToken: cancelToken
  });
};

export const getQuery = (url, token?, params?, progressEvent?, cancelToken?) => {
  return serverQuery("GET", url, token, {}, params, progressEvent, cancelToken);
}

export const postQuery = (url, token?, data?, progressEvent?, cancelToken?) => {
  return serverQuery("POST", url, token, data, {}, progressEvent, cancelToken);
}

export const putQuery = (url, token?, data?, progressEvent?, cancelToken?) => {
  return serverQuery("PUT", url, token, data, {}, progressEvent, cancelToken);
}

export const deleteQuery = (url, token?, params?, progressEvent?, cancelToken?) => {
  return serverQuery("DELETE", url, token, {}, params, progressEvent, cancelToken);
}

export const patchQuery = (url, token?, fields?, progressEvent?, cancelToken?)=> {
  return serverQuery("PATCH", url, token, {}, fields, progressEvent, cancelToken);
}

export const patchQueryFormData = (url, token?, fields?, progressEvent?, cancelToken?)=> {
  return instanceMultipart.patch(url, _objToForm(fields), {
    headers: {
      "token": token,
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: _getProgressEvent(progressEvent),
    cancelToken: cancelToken
  })
}

export const postQueryFormData = (url, token?, fields?, progressEvent?, cancelToken?)=> {
  return instanceMultipart.post(url, _objToForm(fields), {
    headers: {
      "token": token,
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: _getProgressEvent(progressEvent),
    cancelToken: cancelToken
  })
}

export const putQueryFormData = (url, token?, fields?, progressEvent?, cancelToken?) => {
  return instanceMultipart.put(url, _objToForm(fields), {
    headers: {
      "token": token,
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: _getProgressEvent(progressEvent),
    cancelToken: cancelToken
  })
}
