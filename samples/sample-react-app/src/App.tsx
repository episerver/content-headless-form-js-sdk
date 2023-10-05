import './App.css';
import { useFetch } from './hooks/useFetch';
import Form from './components/Form';
import { extractParams } from './helpers/urlHelper';

function App() {
  const { relativePath, language } = extractParams(window.location.pathname)
  const url = `${process.env.REACT_APP_ENDPOINT_GET_FORM_BY_PAGE_URL}${relativePath}`;
  const {data: pageData, loading} = useFetch(url);

  return (
    <div className="App">
      {loading && <div className='loading'>Loading...</div>}
      {!loading && pageData && (
          <>
            <h1>{pageData.title}</h1>
            {pageData.childrens.map((c: any) => (
              <Form 
                formKey={c.reference.key} 
                key={c.reference.key} 
                language={language ?? "en"}/>
            ))}
          </>
      )}
    </div>
  );
}

export default App;
