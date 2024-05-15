import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Button from './components/Button';
import ResponseTable from './components/ResponsableTable';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

function App() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [response, setResponse] = useState(null);
  const [responseOnCode, setResponseOnCode] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const onCodeChange = (event) => {
    setCode(event.target.value);
  };

  const onFileFormSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error('Por favor, selecciona un archivo');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://localhost:3003/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorMessage = response.status === 404 ? 'No se encontraron tokens válidos en el archivo analizado' : await response.text();
      toast.error(errorMessage);
      return;
    }
    const data = await response.json();
    setResponse(data);
    toast.success('Tu archivo ha sido analizado con éxito');
  };

  const onCodeFormSubmit = async (event) => {
    event.preventDefault();
    if (!code.trim()) {
      toast.error('Por favor, introduce código');
      return;
    }
    const responseOnCode = await fetch('http://localhost:3003/analyze', {
      method: 'POST',
      body: code,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    if (!responseOnCode.ok) {
      const errorMessage = responseOnCode.status === 404 ? 'No se encontraron tokens válidos en el código analizado' : await responseOnCode.text();
      toast.error(errorMessage);
      return;
    }
    const data = await responseOnCode.json();
    setResponseOnCode(data);
    toast.success('Tu código ha sido analizado con éxito');
  };


  return (
    <div>
      <h1 className='title'>Analizador Léxico Web</h1>
      <div className='container'>
        <div className='container-B'>
          <form className='form-B' onSubmit={onCodeFormSubmit}>
            <textarea placeholder='Introduce el código que deseas analizar' className='text-area-B' onChange={onCodeChange} value={code} />
            <Button text='Generar Análisis' />
          </form>
          <ResponseTable response={responseOnCode} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
