import './App.css';
import { useFetch } from './useFetch';
import { Form, FormLogin } from '@episerver/forms-react';
import { FormCache, FormConstants, IdentityInfo, extractParams } from '@episerver/forms-sdk';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useHistoryCompatible } from './hooks/useHistoryCompatible';

function App() {
    const location = useLocation();
    const { language } = extractParams(window.location.pathname)
    const url = `${import.meta.env.REACT_APP_ENDPOINT_GET_FORM_BY_PAGE_URL}${location.pathname}`;
    
    const { data: pageData, loading } = useFetch(url);
    
    const formCache = new FormCache();
    const [identityInfo, setIdentityInfo] = useState<IdentityInfo>({
        accessToken: formCache.get<string>(FormConstants.FormAccessToken)
    } as IdentityInfo);

    const history = useHistoryCompatible()

    const handleAuthen = (identityInfo: IdentityInfo) => {
        setIdentityInfo(identityInfo);
    }

    return (
        <div className="App">
            {loading && <div className='loading'>Loading...</div>}

            {!loading && pageData && (
                <>
                    <h1>{pageData.title}</h1>
                    <div className='main'>
                        <div className='left'>
                            {pageData.formKeys.map((formKey: any) => (
                                <Form
                                    key={formKey}
                                    formKey={formKey}
                                    language={language ?? "en"}
                                    baseUrl={import.meta.env.REACT_APP_HEADLESS_FORM_BASE_URL ?? "/"}
                                    identityInfo={identityInfo} 
                                    history={history}
                                    currentPageUrl={pageData.pageUrl}
                                    // optiGraphUrl={import.meta.env.REACT_APP_CONTENT_GRAPH_GATEWAY_URL}
                                />
                            ))}
                        </div>
                        <div className={`right`}>
                            <h2>Login</h2>
                            <FormLogin
                                clientId='TestClient'
                                authBaseUrl={import.meta.env.REACT_APP_AUTH_BASEURL ?? ""}
                                onAuthenticated={handleAuthen} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
