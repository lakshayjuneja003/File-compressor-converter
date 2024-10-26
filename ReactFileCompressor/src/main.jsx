
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom'
import ImageCompressor from './Components/FileUplaodAndDownload.jsx';
import ConvertImage from './pages/Convert.jsx';
createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <Router>
      <Routes>
          <Route path="/" element={<App />} />
          <Route path='/convert' element={<ConvertImage/>} />
        </Routes>
      </Router>
    </RecoilRoot>
)
