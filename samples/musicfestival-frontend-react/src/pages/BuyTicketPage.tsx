import { Form, FormContainerBlock, FormLogin } from '@episerver/forms-react';
import { FormCache, FormConstants, IdentityInfo, extractParams } from '@episerver/forms-sdk';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFetch } from '../useFetch';
import SearchButton from '../components/SearchButton';
import { getImageUrl } from '../helpers/urlHelper';

type BuyTicketPageProps = {
    content: any,
}

function BuyTicketPage({ content }: BuyTicketPageProps) {
    const formCache = new FormCache();

    const [identityInfo, setIdentityInfo] = useState<IdentityInfo>({
        accessToken: formCache.get<string>(FormConstants.FormAccessToken)
    } as IdentityInfo);

    useEffect(() => {
        setIdentityInfo({
            accessToken: formCache.get<string>(FormConstants.FormAccessToken)
        } as IdentityInfo)
    }, [formCache.get<string>(FormConstants.FormAccessToken)]);

    const history = useNavigate()
    return (
        <>
            {content &&
                <div>
                    <nav className="Page-container PageHeader NavBar">
                        <div className="nav-table">
                            <div className="nav-table-row">
                                <div className="nav-table-cell">
                                    <button className="Button buy-ticket-button"
                                        onClick={() => {
                                            window.location.href = `${window.location.origin}/en/buy-ticket-now/`;
                                        }}
                                    >Buy Ticket Now</button>
                                </div>
                                <div className="nav-table-cell">
                                    <button className="Button buy-ticket-button"
                                        onClick={() => {
                                            window.location.href = `${window.location.origin}/en/sample-form/`;
                                        }}
                                    >Sample Form</button>
                                </div>
                                <div className="nav-table-cell search-button-block">
                                    <SearchButton />
                                </div>
                            </div>
                        </div>
                    </nav>
                    <main className='Page-container'>
                        {content.MainContentArea.map((c: any) => (
                            <FormContainerBlock
                                form={JSON.parse(c.ContentLink.Expanded.FormRenderTemplate)}
                                key={c.ContentLink.Expanded.ContentLink.GuidValue}
                                identityInfo={identityInfo}
                                baseUrl={process.env.REACT_APP_HEADLESS_FORM_BASE_URL ?? "/"}
                                history={history}
                                currentPageUrl={content.Url} />
                        ))}
                    </main>
                </div>
            }
        </>
    )
}

export default BuyTicketPage;