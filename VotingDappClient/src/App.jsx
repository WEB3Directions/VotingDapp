import Web3Provider from './context/Web3Provider'
import { routes } from './routes/routes'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import CurrentUnixTimestamp from './components/TimeStamp/UnixTimeStamp'
function App() {
  
  return (
    <>
<CurrentUnixTimestamp/>

     <Web3Provider>
      <RouterProvider router={routes}></RouterProvider>
     </Web3Provider>
    </>
  )
}

export default App
