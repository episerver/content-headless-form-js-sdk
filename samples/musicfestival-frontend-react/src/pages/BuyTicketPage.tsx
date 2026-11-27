import { Form, FormContainerBlock, FormLogin } from '@episerver/forms-react';
import { FormCache, FormConstants, IdentityInfo, extractParams } from '@episerver/forms-sdk';
import { useEffect, useState } from 'react';
import { useHistoryCompatible } from '../hooks/useHistoryCompatible';
import SearchButton from '../components/SearchButton';

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

    const history = useHistoryCompatible()
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
                        {content.MainContentArea.map((c: any) => {
                            const key = (c.ContentLink.Expanded.ContentLink.GuidValue as string).replace(/-/g,"")
                            return (
                                <Form
                                    key={key}
                                    formKey={key}
                                    language={c.ContentLink.Expanded.Language.Name}
                                    baseUrl={import.meta.env.REACT_APP_HEADLESS_FORM_BASE_URL ?? "/"}
                                    identityInfo={identityInfo}
                                    history={history}
                                    optiGraphUrl={import.meta.env.REACT_APP_CONTENT_GRAPH_GATEWAY_URL}
                                />
                            )
                        })}
                    </main>
                </div>
            }
        </>
    )
}

export default BuyTicketPage;