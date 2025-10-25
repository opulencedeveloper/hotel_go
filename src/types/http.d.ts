type HttpRequestConfigType = {
  url: string;
  method: string;
  contentType?: string;
  successMessage?: string;
  baseURL?: string;
  params?: any;
  body?: any;
};

export interface HttpRequestConfigProps {
  requestConfig: HttpRequestConfigType;
  successRes: (data: any) => void;
}