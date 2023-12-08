import './App.css';
import { useFetch } from './hooks/useFetch';
import { Form, FormLogin } from '@episerver/forms-react';
import { extractParams } from './helpers/urlHelper';
import { FormCache, FormConstants, IdentityInfo } from '@episerver/forms-sdk';
import { useState } from 'react';

function App() {
  const { relativePath, language } = extractParams(window.location.pathname)
  const url = `${process.env.REACT_APP_ENDPOINT_GET_FORM_BY_PAGE_URL}${relativePath}`;
  const {data: pageData, loading} = useFetch(url);
  const formCache = new FormCache();
  const [identityInfo, setIdentityInfo] = useState<IdentityInfo>({
    accessToken: formCache.get<string>(FormConstants.FormAccessToken)
  } as IdentityInfo);

  const handleAuthen = (identityInfo: IdentityInfo) => {
    setIdentityInfo(identityInfo);
  }

  return (
    <div className="App">
      {loading && <div className='loading'>Loading...</div>}
      
      {!loading && pageData && (
          <>
            <h1>{pageData.title}</h1>
            <h2>Login</h2>
            <FormLogin 
              clientId='TestClient' 
              authBaseUrl={process.env.REACT_APP_AUTH_BASEURL ?? ""} 
              onAuthenticated={handleAuthen} />

            {pageData.childrens.map((c: any) => (
              <Form 
                key={c.reference.key}
                formKey={c.reference.key} 
                language={language ?? "en"}
                baseUrl={process.env.REACT_APP_HEADLESS_FORM_BASE_URL}
                identityInfo={identityInfo}/>
            ))}
          </>
      )}
    </div>
  );
}

export default App;
